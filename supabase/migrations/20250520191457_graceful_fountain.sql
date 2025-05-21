-- -----------------------------------------------------
-- Schema sonabel_db
-- -----------------------------------------------------

CREATE DATABASE IF NOT EXISTS `sonabel_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sonabel_db`;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  `last_login` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `queue_date` DATE NOT NULL,
  `queue_time` TIME NOT NULL,
  `queue_position` INT NOT NULL,
  `status` ENUM('pending', 'active', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tickets_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_tickets_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `service_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `icon` VARCHAR(50) NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `services`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `icon` VARCHAR(50) NULL,
  `pricing_info` TEXT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_services_categories_idx` (`category_id` ASC),
  CONSTRAINT `fk_services_categories`
    FOREIGN KEY (`category_id`)
    REFERENCES `service_categories` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `service_requirements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_requirements` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `service_id` INT NOT NULL,
  `requirement` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_requirements_services_idx` (`service_id` ASC),
  CONSTRAINT `fk_requirements_services`
    FOREIGN KEY (`service_id`)
    REFERENCES `services` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `service_requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `reference` VARCHAR(20) NULL,
  `details` TEXT NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `preferred_date` DATE NULL,
  `status` ENUM('pending', 'in_progress', 'completed', 'rejected', 'canceled') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_requests_users_idx` (`user_id` ASC),
  INDEX `fk_requests_services_idx` (`service_id` ASC),
  CONSTRAINT `fk_requests_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_requests_services`
    FOREIGN KEY (`service_id`)
    REFERENCES `services` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `request_updates`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `request_updates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `request_id` INT NOT NULL,
  `status` ENUM('pending', 'in_progress', 'completed', 'rejected', 'canceled') NOT NULL,
  `notes` TEXT NULL,
  `created_by` VARCHAR(50) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_updates_requests_idx` (`request_id` ASC),
  CONSTRAINT `fk_updates_requests`
    FOREIGN KEY (`request_id`)
    REFERENCES `service_requests` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) NULL,
  `reference_id` INT NULL,
  `reference_type` VARCHAR(50) NULL,
  `read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_notifications_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_notifications_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Insert initial data for categories and services
-- -----------------------------------------------------

-- Insert service categories
INSERT INTO `service_categories` (`id`, `name`, `description`, `icon`, `display_order`)
VALUES 
(1, 'Électricité', 'Services liés à la distribution d\'électricité', 'zap', 1),
(2, 'Eau', 'Services liés à la distribution d\'eau', 'droplet', 2),
(3, 'Facturation', 'Services liés à la facturation', 'credit-card', 3),
(4, 'Assistance', 'Services d\'assistance et de réclamation', 'help-circle', 4);

-- Insert services
INSERT INTO `services` (`category_id`, `name`, `description`, `icon`, `pricing_info`, `display_order`)
VALUES 
(1, 'Branchement électrique', 'Demande de nouveau branchement électrique pour votre domicile', 'construction', 'À partir de 50,000 FCFA', 1),
(1, 'Augmentation de puissance', 'Augmentation de la puissance de votre installation électrique existante', 'zap', 'Tarification selon puissance demandée', 2),
(2, 'Branchement eau', 'Demande de raccordement au réseau d\'eau pour votre domicile', 'construction', 'À partir de 45,000 FCFA', 1),
(2, 'Changement compteur eau', 'Demande de remplacement du compteur d\'eau existant', 'refresh-cw', 'À partir de 25,000 FCFA', 2),
(3, 'Paiement de factures', 'Payez vos factures d\'eau et d\'électricité', 'credit-card', 'Gratuit', 1),
(3, 'Réclamation facture', 'Contestation ou réclamation concernant votre facture', 'file-question', 'Gratuit', 2),
(4, 'Signaler une panne', 'Signaler une panne d\'électricité ou d\'eau dans votre quartier', 'alert-triangle', 'Gratuit', 1),
(4, 'Demande d\'information', 'Demande d\'information sur nos services', 'info', 'Gratuit', 2);

-- Insert service requirements
INSERT INTO `service_requirements` (`service_id`, `requirement`, `description`, `display_order`)
VALUES 
(1, 'Pièce d\'identité', 'Copie de la carte nationale d\'identité ou du passeport', 1),
(1, 'Titre de propriété', 'Copie du titre foncier ou contrat de bail', 2),
(1, 'Plan de localisation', 'Plan indiquant l\'emplacement exact du domicile', 3),
(2, 'Pièce d\'identité', 'Copie de la carte nationale d\'identité ou du passeport', 1),
(2, 'Dernière facture', 'Copie de votre dernière facture d\'électricité', 2),
(3, 'Pièce d\'identité', 'Copie de la carte nationale d\'identité ou du passeport', 1),
(3, 'Titre de propriété', 'Copie du titre foncier ou contrat de bail', 2),
(3, 'Plan de localisation', 'Plan indiquant l\'emplacement exact du domicile', 3),
(4, 'Pièce d\'identité', 'Copie de la carte nationale d\'identité ou du passeport', 1),
(4, 'Dernière facture', 'Copie de votre dernière facture d\'eau', 2),
(5, 'Référence de facture', 'Numéro de référence de la facture à payer', 1),
(6, 'Facture contestée', 'Copie de la facture que vous souhaitez contester', 1),
(6, 'Motif de réclamation', 'Description détaillée du problème avec la facture', 2),
(7, 'Localisation', 'Adresse précise où la panne a été constatée', 1),
(7, 'Description', 'Description détaillée du problème observé', 2),
(8, 'Sujet de la demande', 'Précisez le sujet sur lequel vous souhaitez obtenir des informations', 1);
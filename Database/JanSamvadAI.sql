IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Contractors] (
        [Id] int NOT NULL IDENTITY,
        [CompanyName] nvarchar(250) NOT NULL,
        [RegistrationNumber] nvarchar(450) NOT NULL,
        [Address] nvarchar(max) NULL,
        [ContactInformation] nvarchar(max) NULL,
        [DataSource] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Contractors] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Departments] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(150) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [Responsibility] nvarchar(max) NOT NULL,
        [DataSource] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_Departments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Districts] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(200) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [State] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [DataSource] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Districts] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [ComplaintCategories] (
        [Id] int NOT NULL IDENTITY,
        [DefaultDepartmentId] int NULL,
        [Name] nvarchar(150) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_ComplaintCategories] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ComplaintCategories_Departments_DefaultDepartmentId] FOREIGN KEY ([DefaultDepartmentId]) REFERENCES [Departments] ([Id]) ON DELETE SET NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Constituencies] (
        [Id] int NOT NULL IDENTITY,
        [DistrictId] int NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [DataSource] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Constituencies] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Constituencies_Districts_DistrictId] FOREIGN KEY ([DistrictId]) REFERENCES [Districts] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Wards] (
        [Id] int NOT NULL IDENTITY,
        [ConstituencyId] int NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        [Code] nvarchar(450) NOT NULL,
        [Locality] nvarchar(max) NOT NULL,
        [Latitude] float NULL,
        [Longitude] float NULL,
        [DataSource] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Wards] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Wards_Constituencies_ConstituencyId] FOREIGN KEY ([ConstituencyId]) REFERENCES [Constituencies] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [FullName] nvarchar(max) NOT NULL,
        [WardId] int NULL,
        [IsVerified] bit NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [DataSource] nvarchar(max) NOT NULL,
        [UserName] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUsers_Wards_WardId] FOREIGN KEY ([WardId]) REFERENCES [Wards] ([Id]) ON DELETE SET NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Projects] (
        [Id] int NOT NULL IDENTITY,
        [WardId] int NOT NULL,
        [DepartmentId] int NOT NULL,
        [Name] nvarchar(250) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [ProjectType] nvarchar(max) NOT NULL,
        [Location] nvarchar(max) NOT NULL,
        [Status] int NOT NULL,
        [ProgressPercentage] decimal(5,2) NOT NULL,
        [PlannedStartDate] date NULL,
        [PlannedCompletionDate] date NULL,
        [ActualStartDate] date NULL,
        [ActualCompletionDate] date NULL,
        [DataSource] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Projects] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Projects_Departments_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Departments] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Projects_Wards_WardId] FOREIGN KEY ([WardId]) REFERENCES [Wards] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Attachments] (
        [Id] int NOT NULL IDENTITY,
        [OwnerType] int NOT NULL,
        [OwnerId] int NOT NULL,
        [FileName] nvarchar(max) NOT NULL,
        [FileUrl] nvarchar(max) NOT NULL,
        [ContentType] nvarchar(max) NOT NULL,
        [FileSizeBytes] bigint NOT NULL,
        [UploadedById] nvarchar(450) NOT NULL,
        [UploadedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Attachments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Attachments_AspNetUsers_UploadedById] FOREIGN KEY ([UploadedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AuditLogs] (
        [Id] bigint NOT NULL IDENTITY,
        [UserId] nvarchar(450) NULL,
        [Action] nvarchar(max) NOT NULL,
        [EntityName] nvarchar(450) NOT NULL,
        [EntityId] nvarchar(450) NOT NULL,
        [OldValues] nvarchar(max) NULL,
        [NewValues] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AuditLogs_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Complaints] (
        [Id] int NOT NULL IDENTITY,
        [ComplaintNumber] nvarchar(450) NOT NULL,
        [CitizenId] nvarchar(450) NOT NULL,
        [WardId] int NOT NULL,
        [DepartmentId] int NULL,
        [ProjectId] int NULL,
        [CategoryId] int NULL,
        [Title] nvarchar(250) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [Location] nvarchar(max) NOT NULL,
        [Latitude] decimal(9,6) NULL,
        [Longitude] decimal(9,6) NULL,
        [Priority] int NOT NULL,
        [Status] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [ResolvedAt] datetime2 NULL,
        [DataSource] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Complaints] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Complaints_AspNetUsers_CitizenId] FOREIGN KEY ([CitizenId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Complaints_ComplaintCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [ComplaintCategories] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Complaints_Departments_DepartmentId] FOREIGN KEY ([DepartmentId]) REFERENCES [Departments] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Complaints_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Complaints_Wards_WardId] FOREIGN KEY ([WardId]) REFERENCES [Wards] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [DelayRecords] (
        [Id] int NOT NULL IDENTITY,
        [ProjectId] int NOT NULL,
        [Reason] nvarchar(max) NOT NULL,
        [StartDate] date NOT NULL,
        [EndDate] date NULL,
        [DelayDays] int NOT NULL,
        [Description] nvarchar(max) NULL,
        [ReportedById] nvarchar(450) NULL,
        CONSTRAINT [PK_DelayRecords] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_DelayRecords_AspNetUsers_ReportedById] FOREIGN KEY ([ReportedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_DelayRecords_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [FinancialTransactions] (
        [Id] int NOT NULL IDENTITY,
        [ProjectId] int NOT NULL,
        [TransactionDate] date NOT NULL,
        [TransactionType] int NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [ReferenceNumber] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [DataSource] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_FinancialTransactions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_FinancialTransactions_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [ProjectBudgets] (
        [Id] int NOT NULL IDENTITY,
        [ProjectId] int NOT NULL,
        [EstimatedCost] decimal(18,2) NULL,
        [SanctionedAmount] decimal(18,2) NULL,
        [TenderAmount] decimal(18,2) NULL,
        [ContractAmount] decimal(18,2) NULL,
        [BudgetDate] date NOT NULL,
        [DataSource] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_ProjectBudgets] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProjectBudgets_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [ProjectContractors] (
        [ProjectId] int NOT NULL,
        [ContractorId] int NOT NULL,
        [ContractorRole] nvarchar(max) NOT NULL,
        [AssignedDate] date NOT NULL,
        CONSTRAINT [PK_ProjectContractors] PRIMARY KEY ([ProjectId], [ContractorId]),
        CONSTRAINT [FK_ProjectContractors_Contractors_ContractorId] FOREIGN KEY ([ContractorId]) REFERENCES [Contractors] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_ProjectContractors_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [ProjectMilestones] (
        [Id] int NOT NULL IDENTITY,
        [ProjectId] int NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [PlannedDate] date NULL,
        [ActualDate] date NULL,
        [CompletionPercentage] decimal(5,2) NOT NULL,
        [Status] int NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_ProjectMilestones] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProjectMilestones_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [ProjectUpdates] (
        [Id] int NOT NULL IDENTITY,
        [ProjectId] int NOT NULL,
        [AuthorId] nvarchar(450) NOT NULL,
        [UpdateDate] datetime2 NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [ProgressPercentage] decimal(5,2) NULL,
        [Location] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [DataSource] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_ProjectUpdates] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ProjectUpdates_AspNetUsers_AuthorId] FOREIGN KEY ([AuthorId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_ProjectUpdates_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [WorkOrders] (
        [Id] int NOT NULL IDENTITY,
        [ProjectId] int NOT NULL,
        [WorkOrderNumber] nvarchar(450) NOT NULL,
        [IssueDate] date NOT NULL,
        [StartDate] date NULL,
        [PlannedCompletionDate] date NULL,
        [ContractAmount] decimal(18,2) NULL,
        [Status] int NOT NULL,
        CONSTRAINT [PK_WorkOrders] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_WorkOrders_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [AiClassifications] (
        [Id] int NOT NULL IDENTITY,
        [ComplaintId] int NOT NULL,
        [PredictedCategoryId] int NULL,
        [RecommendedDepartmentId] int NULL,
        [RecommendedPriority] int NULL,
        [ConfidenceScore] decimal(5,4) NOT NULL,
        [ModelVersion] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [IsApplied] bit NOT NULL,
        CONSTRAINT [PK_AiClassifications] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AiClassifications_ComplaintCategories_PredictedCategoryId] FOREIGN KEY ([PredictedCategoryId]) REFERENCES [ComplaintCategories] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_AiClassifications_Complaints_ComplaintId] FOREIGN KEY ([ComplaintId]) REFERENCES [Complaints] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AiClassifications_Departments_RecommendedDepartmentId] FOREIGN KEY ([RecommendedDepartmentId]) REFERENCES [Departments] ([Id]) ON DELETE SET NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [ComplaintHistories] (
        [Id] int NOT NULL IDENTITY,
        [ComplaintId] int NOT NULL,
        [OldStatus] int NULL,
        [NewStatus] int NOT NULL,
        [ChangedById] nvarchar(450) NOT NULL,
        [ChangedAt] datetime2 NOT NULL,
        [Remarks] nvarchar(max) NULL,
        CONSTRAINT [PK_ComplaintHistories] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ComplaintHistories_AspNetUsers_ChangedById] FOREIGN KEY ([ChangedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_ComplaintHistories_Complaints_ComplaintId] FOREIGN KEY ([ComplaintId]) REFERENCES [Complaints] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [ComplaintRelationships] (
        [Id] int NOT NULL IDENTITY,
        [ComplaintId1] int NOT NULL,
        [ComplaintId2] int NOT NULL,
        [RelationshipType] int NOT NULL,
        [SimilarityScore] decimal(5,4) NOT NULL,
        [VerifiedById] nvarchar(450) NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_ComplaintRelationships] PRIMARY KEY ([Id]),
        CONSTRAINT [CK_ComplaintRelationship_DifferentComplaints] CHECK ([ComplaintId1] <> [ComplaintId2]),
        CONSTRAINT [FK_ComplaintRelationships_AspNetUsers_VerifiedById] FOREIGN KEY ([VerifiedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_ComplaintRelationships_Complaints_ComplaintId1] FOREIGN KEY ([ComplaintId1]) REFERENCES [Complaints] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_ComplaintRelationships_Complaints_ComplaintId2] FOREIGN KEY ([ComplaintId2]) REFERENCES [Complaints] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE TABLE [Feedback] (
        [Id] int NOT NULL IDENTITY,
        [ComplaintId] int NULL,
        [ProjectId] int NULL,
        [CitizenId] nvarchar(450) NOT NULL,
        [Rating] tinyint NOT NULL,
        [Comment] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Feedback] PRIMARY KEY ([Id]),
        CONSTRAINT [CK_Feedback_Rating] CHECK ([Rating] BETWEEN 1 AND 5),
        CONSTRAINT [CK_Feedback_Target] CHECK ([ComplaintId] IS NOT NULL OR [ProjectId] IS NOT NULL),
        CONSTRAINT [FK_Feedback_AspNetUsers_CitizenId] FOREIGN KEY ([CitizenId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Feedback_Complaints_ComplaintId] FOREIGN KEY ([ComplaintId]) REFERENCES [Complaints] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Feedback_Projects_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [Projects] ([Id]) ON DELETE SET NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AiClassifications_ComplaintId] ON [AiClassifications] ([ComplaintId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AiClassifications_PredictedCategoryId] ON [AiClassifications] ([PredictedCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AiClassifications_RecommendedDepartmentId] ON [AiClassifications] ([RecommendedDepartmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AspNetUsers_WardId] ON [AspNetUsers] ([WardId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Attachments_OwnerType_OwnerId] ON [Attachments] ([OwnerType], [OwnerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Attachments_UploadedById] ON [Attachments] ([UploadedById]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AuditLogs_CreatedAt] ON [AuditLogs] ([CreatedAt]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AuditLogs_EntityName_EntityId] ON [AuditLogs] ([EntityName], [EntityId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_AuditLogs_UserId] ON [AuditLogs] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ComplaintCategories_Code] ON [ComplaintCategories] ([Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ComplaintCategories_DefaultDepartmentId] ON [ComplaintCategories] ([DefaultDepartmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ComplaintHistories_ChangedById] ON [ComplaintHistories] ([ChangedById]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ComplaintHistories_ComplaintId_ChangedAt] ON [ComplaintHistories] ([ComplaintId], [ChangedAt]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ComplaintRelationships_ComplaintId1_ComplaintId2_RelationshipType] ON [ComplaintRelationships] ([ComplaintId1], [ComplaintId2], [RelationshipType]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ComplaintRelationships_ComplaintId2] ON [ComplaintRelationships] ([ComplaintId2]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ComplaintRelationships_VerifiedById] ON [ComplaintRelationships] ([VerifiedById]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Complaints_CategoryId] ON [Complaints] ([CategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Complaints_CitizenId] ON [Complaints] ([CitizenId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Complaints_ComplaintNumber] ON [Complaints] ([ComplaintNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Complaints_DepartmentId] ON [Complaints] ([DepartmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Complaints_ProjectId] ON [Complaints] ([ProjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Complaints_WardId_Status_CreatedAt] ON [Complaints] ([WardId], [Status], [CreatedAt]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Constituencies_DistrictId_Code] ON [Constituencies] ([DistrictId], [Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Contractors_RegistrationNumber] ON [Contractors] ([RegistrationNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_DelayRecords_ProjectId] ON [DelayRecords] ([ProjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_DelayRecords_ReportedById] ON [DelayRecords] ([ReportedById]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Departments_Code] ON [Departments] ([Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Districts_Code] ON [Districts] ([Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Feedback_CitizenId] ON [Feedback] ([CitizenId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Feedback_ComplaintId] ON [Feedback] ([ComplaintId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Feedback_ProjectId] ON [Feedback] ([ProjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_FinancialTransactions_ProjectId_TransactionDate] ON [FinancialTransactions] ([ProjectId], [TransactionDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ProjectBudgets_ProjectId] ON [ProjectBudgets] ([ProjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ProjectContractors_ContractorId] ON [ProjectContractors] ([ContractorId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ProjectMilestones_ProjectId] ON [ProjectMilestones] ([ProjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Projects_DepartmentId] ON [Projects] ([DepartmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_Projects_WardId_Status] ON [Projects] ([WardId], [Status]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ProjectUpdates_AuthorId] ON [ProjectUpdates] ([AuthorId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_ProjectUpdates_ProjectId] ON [ProjectUpdates] ([ProjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Wards_ConstituencyId_Code] ON [Wards] ([ConstituencyId], [Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE INDEX [IX_WorkOrders_ProjectId] ON [WorkOrders] ([ProjectId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    CREATE UNIQUE INDEX [IX_WorkOrders_WorkOrderNumber] ON [WorkOrders] ([WorkOrderNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260818120941_InitialDatabase'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260818120941_InitialDatabase', N'8.0.0');
END;
GO

COMMIT;
GO


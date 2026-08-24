-- CreateTable
CREATE TABLE "schemes" (
    "id" SERIAL NOT NULL,
    "scheme_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hindi_name" TEXT,
    "ministry" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "target_beneficiaries" TEXT NOT NULL,
    "eligibility" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "documents_required" JSONB NOT NULL,
    "application_steps" JSONB NOT NULL,
    "official_url" TEXT NOT NULL,
    "source_metadata" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "application_id" TEXT NOT NULL,
    "scheme_id" TEXT NOT NULL DEFAULT 'SCH-001',
    "scheme_name" TEXT NOT NULL,
    "applicant_name" TEXT NOT NULL DEFAULT 'Citizen',
    "details" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "history" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievances" (
    "id" SERIAL NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "duration" TEXT,
    "description" TEXT NOT NULL,
    "citizen_phone" TEXT NOT NULL DEFAULT 'Simulated Citizen',
    "status" TEXT NOT NULL DEFAULT 'Registered',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "history" JSONB NOT NULL DEFAULT '[]',
    "resolution_notes" TEXT NOT NULL DEFAULT '',
    "assigned_officer" TEXT NOT NULL DEFAULT 'Unassigned',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grievances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schemes_scheme_id_key" ON "schemes"("scheme_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_application_id_key" ON "applications"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "grievances_ticket_id_key" ON "grievances"("ticket_id");

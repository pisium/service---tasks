-- CreateTable
CREATE TABLE "TaskMember" (
    "taskId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,

    PRIMARY KEY ("taskId", "memberId"),
    CONSTRAINT "TaskMember_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

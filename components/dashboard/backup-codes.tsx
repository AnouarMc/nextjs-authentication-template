"use client";

import FormError from "@/components/auth/form-error";
import { regenerateBackupCodes } from "@/actions/two-factor";
import DashboardCard from "@/components/dashboard/dashboard-card";

import {
  Files,
  Download,
  Printer,
  Archive,
  Check,
  Ellipsis,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const BackupCodes = ({ firstTimeBackups }: { firstTimeBackups: string[] }) => {
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackup, setShowBackup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regenerate = async () => {
    setIsSubmitting(true);
    setShowBackup(true);
    const { success, errors, backupCodes } = await regenerateBackupCodes();
    if (success && backupCodes) {
      setBackupCodes(backupCodes);
    } else if (errors) {
      setError(errors?.[0].message);
    }
    setIsSubmitting(false);
  };

  const copyToClipboard = () => {
    const codesString = backupCodes.join(", ");
    navigator.clipboard.writeText(codesString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const downloadFile = () => {
    const codesString = backupCodes.join("\n");
    const blob = new Blob([codesString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${process.env.NEXT_PUBLIC_APP_NAME}_backup_codes.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printCodes = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "-2000px";
    iframe.style.bottom = "-2000px";
    iframe.onload = () => {
      if (iframe.contentDocument) {
        const codesString = backupCodes.join("\n");
        iframe.contentDocument.body.innerHTML = `<pre>${codesString}</pre>`;
        iframe.contentWindow?.print();
      }
    };
    window.document.body.appendChild(iframe);
  };

  useEffect(() => {
    if (firstTimeBackups?.length !== 0) {
      setShowBackup(true);
      setBackupCodes(firstTimeBackups);
    }
  }, [firstTimeBackups]);

  return (
    <div className="max-w-screen-sm flex flex-col md:flex-row mt-2">
      <div className="grow overflow-hidden">
        <div className="flex items-center gap-x-2 px-4">
          <Archive className="w-4 h-4" />
          <span>Backup codes</span>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-auto"
              asChild
            >
              <Button size="sm" variant="ghost" className="ml-auto">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={regenerate}>
                Regenerate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <DashboardCard
          title="Add backup code verification"
          subtitle="Backup codes are now enabled. You can use one of these to sign in to your account, if you lose access to your authentication device. Each code can only be used once"
          isVisible={showBackup}
        >
          {isSubmitting ? (
            <div className="w-full py-2 mt-2 mb-4 flex justify-center items-center mx-auto border">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : error ? (
            <FormError message={error} />
          ) : (
            <div className="border rounded-lg mt-2 mb-4 ">
              <div className="grid grid-cols-2 text-center gap-y-4 pt-4">
                {backupCodes.map((code) => (
                  <div key={code}>{code}</div>
                ))}
              </div>
              <div className="grid grid-cols-3 mt-4">
                <Button
                  variant="outline"
                  className="rounded-none"
                  onClick={downloadFile}
                >
                  <Download />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check /> : <Files />}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none"
                  onClick={printCodes}
                >
                  <Printer />
                </Button>
              </div>
            </div>
          )}

          <div className="flex">
            <Button
              className="ml-auto"
              disabled={isSubmitting}
              onClick={() => {
                setBackupCodes([]);
                setShowBackup(false);
              }}
            >
              Finish
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
export default BackupCodes;

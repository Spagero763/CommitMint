"use client";
import { useState, useEffect } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import abi from "@/abi/pocnft.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ExternalLink } from "lucide-react";

const CONTRACT_ADDRESS = "0x029549CA7179769Bd934B41F4c8F17979A743DE6";

export default function Home() {
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const [contributor, setContributor] = useState("");
  const [repo, setRepo] = useState("");
  const [summary, setSummary] = useState("");

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const handleMint = async () => {
    if (!contributor || !repo || !summary) {
      toast({
        title: "Missing fields",
        description: "Please fill in all the details for the contribution.",
        variant: "destructive",
      });
      return;
    }
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: 'mint',
      args: [contributor, repo, summary],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
  });
  
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "NFT Minted Successfully!",
        description: "Your proof of contribution has been immortalized on the blockchain.",
        action: hash ? (
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Basescan <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : undefined,
      });
      // Reset form
      setContributor("");
      setRepo("");
      setSummary("");
    }
    if (error) {
      toast({
        title: "Error Minting NFT",
        description: error.shortMessage || error.message,
        variant: "destructive",
      });
    }
  }, [isConfirmed, error, hash, toast]);
  
  const isButtonDisabled = isPending || isConfirming || !contributor || !repo || !summary;

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-6 right-6">
        <ConnectButton />
      </div>

      <Card className="w-full max-w-md shadow-2xl animate-in fade-in duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Contribution Mint</CardTitle>
          <CardDescription>Immortalize your contributions on-chain as a unique NFT.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {isConnected ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="contributor">Contributor Handle</Label>
                <Input
                  id="contributor"
                  type="text"
                  placeholder="@your_handle"
                  value={contributor}
                  onChange={(e) => setContributor(e.target.value)}
                  disabled={isPending || isConfirming}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo">Repository URL</Label>
                <Input
                  id="repo"
                  type="text"
                  placeholder="github.com/owner/repo-name"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  disabled={isPending || isConfirming}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Contribution Summary</Label>
                <Input
                  id="summary"
                  type="text"
                  placeholder="e.g., Fixed a critical bug"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  disabled={isPending || isConfirming}
                />
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                <p>Please connect your wallet to mint an NFT.</p>
            </div>
          )}
        </CardContent>
        {isConnected && (
            <CardFooter>
            <Button
              onClick={handleMint}
              disabled={isButtonDisabled}
              className="w-full bg-accent hover:bg-accent/90"
              size="lg"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isConfirming ? 'Confirming Transaction...' : 'Minting...'}
                </>
              ) : (
                "Mint PoC NFT"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
      <footer className="absolute bottom-4 text-center text-muted-foreground text-sm">
        Contract on Base Sepolia Network
      </footer>
    </main>
  );
}

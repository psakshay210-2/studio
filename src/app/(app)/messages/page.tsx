import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MOCK_CHANNELS, MOCK_USERS } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function MessagesPage() {
  const activeChannel = MOCK_CHANNELS[0];
  const currentUser = MOCK_USERS[0];

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <PageHeader title="Messages" description="Communicate with your team and vendors." />
      <div className="flex-1 grid md:grid-cols-[280px_1fr] gap-6 mt-8 overflow-hidden">
        {/* Channels List */}
        <Card className="hidden md:flex flex-col">
          <CardHeader>
            <Input placeholder="Search messages..." />
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-4 pt-0">
              <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2">Channels</h3>
              {MOCK_CHANNELS.filter(c => c.name.startsWith('#')).map(channel => (
                <button key={channel.id} className="w-full text-left p-2 rounded-md hover:bg-muted font-medium text-sm text-foreground bg-primary/5">
                  {channel.name}
                </button>
              ))}
              <h3 className="text-xs font-bold uppercase text-muted-foreground my-2">Direct Messages</h3>
              {MOCK_CHANNELS.filter(c => c.name.startsWith('@')).map(channel => (
                <button key={channel.id} className="w-full text-left p-2 rounded-md hover:bg-muted text-sm text-muted-foreground flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={MOCK_USERS.find(u => u.name.includes(channel.name.slice(1)))?.avatar} />
                    <AvatarFallback>{channel.name.charAt(1)}</AvatarFallback>
                  </Avatar>
                  {channel.name.slice(1)}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Message View */}
        <Card className="flex flex-col h-full">
          <CardHeader className="border-b">
            <h2 className="font-semibold text-lg">{activeChannel.name}</h2>
            <p className="text-sm text-muted-foreground">3 members</p>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {activeChannel.messages.map((message, index) => (
                <div key={message.id} className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold">{message.sender.name}</p>
                      <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                    </div>
                    <p className="text-foreground/90">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-background">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-12" />
              <Button size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

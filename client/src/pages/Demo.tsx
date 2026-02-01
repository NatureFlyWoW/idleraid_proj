import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema } from "@shared/schema";
import { useMessages, useCreateMessage } from "@/hooks/use-messages";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, SendHorizontal, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { InsertMessage } from "@shared/routes";

export default function Demo() {
  const { data: messages, isLoading } = useMessages();
  const createMessage = useCreateMessage();
  const { toast } = useToast();

  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      content: "",
      isSystem: false,
    },
  });

  const onSubmit = (data: InsertMessage) => {
    createMessage.mutate(data, {
      onSuccess: () => {
        form.reset();
        toast({
          title: "Message sent",
          description: "Your message has been added to the list.",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary mb-4">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-display font-bold">API Integration Demo</h1>
        <p className="text-muted-foreground text-lg">
          A working example of React Query + Zod + Express integration.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Input Section */}
        <div className="bg-card rounded-2xl border p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Post a Message</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Type something amazing..." 
                        className="h-12 bg-secondary/20 border-transparent focus:border-primary focus:bg-background transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                size="lg"
                disabled={createMessage.isPending}
                className="h-12 px-6 rounded-lg shrink-0"
              >
                {createMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send <SendHorizontal className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold">Recent Messages</h2>
            <span className="text-sm text-muted-foreground">
              {messages?.length || 0} items
            </span>
          </div>
          
          <div className="space-y-3 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
                <p>Loading messages...</p>
              </div>
            ) : messages?.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-dashed bg-secondary/10">
                <p className="text-muted-foreground">No messages yet. Be the first to post!</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {messages?.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    className="group bg-card p-4 rounded-xl border hover:border-primary/20 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                        {msg.id}
                      </div>
                      <p className="text-foreground pt-1 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

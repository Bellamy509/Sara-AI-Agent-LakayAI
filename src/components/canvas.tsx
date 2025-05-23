"use client";

import * as Skeletons from "@/components/skeletons";
import { Settings } from "lucide-react";
import React, { Suspense, useState, useContext, useEffect } from "react";
import { ChatWindow } from "./chat-window";
import { MCPConfigModal } from "./mcp-config-modal";
import { TodoProvider } from "@/contexts/TodoContext";
import { TodoApp } from "./Todo";
import VisualRepresentation from "./VisualRepresentation";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { ServerConfigsContext } from "@/providers/Providers";
import { motion } from "framer-motion";
import UserProfileMenu from "./UserProfileMenu";
import { supabase } from "@/lib/supabaseClient";

export default function Canvas() {
  const [showMCPConfigModal, setShowMCPConfigModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);
  useCopilotChatSuggestions(
    {
      instructions:
        "Check the Asana workspace. Make sure it's the parent workspace. If Asana is connected, first get the workspace projects and ID details, then read them back to me. Then, suggest creating a ticket in Asana with each task as a bullet point. If Typefully is connected, suggest a draft tweet with the Asana tasks an individual Tweet in Typefully.",
      minSuggestions: 1,
      maxSuggestions: 2,
    },
    []
  );
  return (
    <TodoProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="w-full bg-white/80 shadow-sm py-4 px-8 flex items-center justify-between border-b border-[#E5E5EA] backdrop-blur-md z-10"
        >
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-br from-[#A23CDC] to-[#B3A0BF] rounded-full p-2 shadow-md flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </span>
            <h1 className="text-2xl font-bold text-[#372D4E] tracking-wide">Lakay AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 4px 24px 0 rgba(80, 120, 255, 0.25)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowMCPConfigModal(true)}
              className="bg-gradient-to-r from-[#A23CDC] to-[#6217B0] text-white font-semibold px-6 py-2 rounded-full shadow hover:scale-105 transition-all flex items-center gap-2 border-none text-base"
            >
              <span className="font-medium">App Store</span>
            </motion.button>
            <UserProfileMenu />
          </div>
        </motion.header>
        <main className="flex-1 flex items-center justify-center py-0 bg-transparent">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", delay: 0.2 }}
            className="w-full max-w-5xl h-[80vh] bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-[#E5E5EA] flex flex-col relative overflow-hidden mx-auto"
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring", delay: 0.4 }}
              className="flex flex-col items-center justify-center pt-12 pb-6"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A23CDC] to-[#B3A0BF] flex items-center justify-center mb-4 shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Good Afternoon, {user?.user_metadata?.first_name && user?.user_metadata?.last_name 
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}` 
                  : user?.user_metadata?.first_name 
                  ? user.user_metadata.first_name 
                  : 'User'}
              </h2>
              <p className="text-lg text-center text-[#A23CDC] font-semibold mt-1">What's on <span className="font-bold">your mind?</span></p>
            </motion.div>
            <div className="flex-1 overflow-y-auto pb-40 px-0 sm:px-0">
              <ChatWindow />
            </div>
            <div className="absolute bottom-0 left-0 w-full flex flex-col items-center z-10">
              <div className="w-full max-w-xl bg-white rounded-full shadow-lg border border-[#E5E5EA] p-2 mb-4 flex items-center">
                {/* L'input du chat CopilotChat est déjà inclus dans ChatWindow, mais ce style sera appliqué si vous personnalisez l'input. */}
              </div>
            </div>
          </motion.div>
        </main>
        <MCPConfigModal
          isOpen={showMCPConfigModal}
          onClose={() => setShowMCPConfigModal(false)}
        />
      </div>
    </TodoProvider>
  );
}

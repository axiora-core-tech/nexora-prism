import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './auth/AuthContext';
import { ThemeProvider } from './auth/ThemeContext';
import { CompanyConfigProvider } from './stores/companyConfigStore';
import { RoadmapProvider } from './stores/roadmapStore';
import { ConversationProvider } from './stores/conversationStore';
import { AvatarProvider } from './stores/avatarStore';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CompanyConfigProvider>
          <RoadmapProvider>
            <ConversationProvider>
              <AvatarProvider>
                <RouterProvider router={router} />
              </AvatarProvider>
            </ConversationProvider>
          </RoadmapProvider>
        </CompanyConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

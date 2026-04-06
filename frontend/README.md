## Folder Struture

src/
│
├── app/
|
│ ├── main.tsx
│ ├── routes.tsx
│ ├── store.ts
│ └── providers.tsx
│
├── features/
│ ├── auth/
│ │ ├── api/
│ │ │ ├── login.api.ts
│ │ │ ├── register.api.ts
│ │ │ ├── logout.api.ts
│ │ │ └── oauth.api.ts
│ │ ├── components/
│ │ │ ├── LoginForm.tsx
│ │ │ ├── RegisterForm.tsx
│ │ │ └── OAuthButtons.tsx
│ │ ├── pages/
│ │ │ ├── LoginPage.tsx
│ │ │ ├── RegisterPage.tsx
│ │ │ └── OAuthCallbackPage.tsx
│ │ ├── store/
│ │ │ ├── authSlice.ts
│ │ │ ├── authThunks.ts
│ │ │ └── authSelectors.ts
│ │ ├── types.ts
│ │ └── utils.ts
│ │
│ ├── profile/
│ │ ├── api/
│ │ │ └── profile.api.ts
│ │ ├── components/
│ │ │ └── ProfileForm.tsx
│ │ ├── pages/
│ │ │ └── ProfilePage.tsx
│ │ ├── store/
│ │ │ ├── profileSlice.ts
│ │ │ ├── profileThunks.ts
│ │ │ └── profileSelectors.ts
│ │ └── types.ts
│ │
│ ├── projects/
│ │ ├── api/
│ │ │ ├── projects.api.ts
│ │ │ └── members.api.ts
│ │ ├── components/
│ │ │ ├── ProjectCard.tsx
│ │ │ ├── ProjectForm.tsx
│ │ │ ├── InviteMemberModal.tsx
│ │ │ └── MemberList.tsx
│ │ ├── pages/
│ │ │ ├── ProjectsPage.tsx
│ │ │ └── ProjectDetailsPage.tsx
│ │ ├── store/
│ │ │ ├── projectsSlice.ts
│ │ │ ├── projectsThunks.ts
│ │ │ └── projectsSelectors.ts
│ │ └── types.ts
│ │
│ ├── tasks/
│ │ ├── api/
│ │ │ ├── tasks.api.ts
│ │ │ └── taskAi.api.ts
│ │ ├── components/
│ │ │ ├── TaskCard.tsx
│ │ │ ├── TaskForm.tsx
│ │ │ ├── KanbanBoard.tsx
│ │ │ ├── TaskList.tsx
│ │ │ ├── TaskFilters.tsx
│ │ │ └── GenerateDescriptionButton.tsx
│ │ ├── pages/
│ │ │ └── TasksPage.tsx
│ │ ├── store/
│ │ │ ├── tasksSlice.ts
│ │ │ ├── tasksThunks.ts
│ │ │ └── tasksSelectors.ts
│ │ └── types.ts
│ │
│ ├── activity/
│ │ ├── api/
│ │ │ └── activity.api.ts
│ │ ├── components/
│ │ │ ├── ActivityItem.tsx
│ │ │ └── ActivityFilter.tsx
│ │ ├── pages/
│ │ │ └── ActivityPage.tsx
│ │ ├── store/
│ │ │ ├── activitySlice.ts
│ │ │ ├── activityThunks.ts
│ │ │ └── activitySelectors.ts
│ │ └── types.ts
│
├── shared/
│ ├── components/
│ │ ├── ui/
│ │ ├── layout/
│ │ │ ├── AppLayout.tsx
│ │ │ ├── Navbar.tsx
│ │ │ ├── Sidebar.tsx
│ │ │ └── PageContainer.tsx
│ │ ├── feedback/
│ │ │ ├── Loader.tsx
│ │ │ ├── EmptyState.tsx
│ │ │ ├── ErrorState.tsx
│ │ │ └── ConfirmDialog.tsx
│ │ └── guards/
│ │ └── ProtectedRoute.tsx
│ │
│ ├── hooks/
│ │ ├── useAppDispatch.ts
│ │ ├── useAppSelector.ts
│ │ └── useDebounce.ts
│ │
│ ├── lib/
│ │ ├── axios.ts
│ │
│ │
│ │
│ ├── utils/
│ │ ├── formatDate.ts
│ │ ├── validators.ts
│ │ ├── apiError.ts
│ │ └── taskHelpers.ts
│ │
│ ├── constants/
│ │ ├── routes.ts
│ │ ├── taskStatus.ts
│ │ └── taskPriority.ts
│ │
│ └── types/
│ ├── api.types.ts
│ └── common.types.ts
│
├── styles/
│ └── globals.css
│
└── env.d.ts

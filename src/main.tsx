import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 2,
            gcTime: 1000 * 60 * 60 * 24, // Keep cache for 24h so persisted data survives
        },
    },
})

const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'himalayan-luxe-cache',
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
    >
        <App />
    </PersistQueryClientProvider>
)

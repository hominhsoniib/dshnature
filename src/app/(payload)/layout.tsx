import config from '@payload-config'
import '@payloadcms/next/css'
import './custom-admin.css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import React from 'react'

import { importMap } from './admin/importMap'
import { AdminEyeToggle } from './admin-eye-toggle'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// Route group (payload) là root layout RIÊNG cho toàn bộ /admin — độc lập với
// (storefront)/layout.tsx (không dùng chung <html>/<body>, không import
// globals.css của Tailwind) để tránh style storefront đè lên UI admin của Payload.
const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    <AdminEyeToggle />
    {children}
  </RootLayout>
)

export default Layout

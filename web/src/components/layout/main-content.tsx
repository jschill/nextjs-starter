function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-muted max-w-7xl mx-auto w-full">
      {children}
    </main>
  )
}

export { MainContent }
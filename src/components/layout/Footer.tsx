export function Footer() {
  return (
    <footer className="mt-auto py-6 border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Blossom Blog. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

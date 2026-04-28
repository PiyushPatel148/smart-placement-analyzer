const Terms = () => {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-foreground">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>Welcome to SkillMatch. By using our website, you agree to these terms.</p>
        
        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Use of the Service</h2>
        <p>This service is a demonstration project. While we strive to provide accurate job matches using the JSearch API, we do not guarantee the availability or accuracy of any specific job listing.</p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. User Content</h2>
        <p>You retain all rights to the resumes you upload. By uploading a file, you grant us the temporary right to parse its text to extract your technical skills. Resumes are processed in memory and are not permanently stored on our servers.</p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. API Limitations</h2>
        <p>Job searches are powered by third-party APIs which may be subject to rate limits. Users have the option to provide their own API keys for uninterrupted access.</p>
      </div>
    </div>
  );
};

export default Terms;
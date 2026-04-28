const Privacy = () => {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold tracking-tight mb-6 text-foreground">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>At SkillMatch, we take your privacy seriously. This is a demo application created for educational purposes.</p>
        
        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, or upload a resume. This includes your name, email, target role, and the technical skills extracted from your documents.</p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services. Specifically, we use your extracted skills to match you with live job API data.</p>

        <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. Security</h2>
        <p>We implement industry-standard security measures, including JWT authentication and encrypted passwords, to protect your personal information.</p>
      </div>
    </div>
  );
};

export default Privacy;
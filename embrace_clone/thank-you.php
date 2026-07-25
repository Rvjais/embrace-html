<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="utf-8" />
    <link href="/Favicon.png" rel="icon" type="image/svg+xml" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta content="Thank you for booking an appointment with eMbrace Lives." name="description" />
    <title>Thank You | eMbrace Lives</title>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link href="https://fonts.gstatic.com" rel="preconnect" />
    <link href="/_external/fonts.googleapis.com/css2_4d2f350a.css" rel="stylesheet" />
    <link href="/assets/index-B-kGA3UA.css" rel="stylesheet" />
  </head>
  <body class="bg-gradient-to-b from-[#E7F7FF] to-[#FFFFFF] min-h-screen flex flex-col">
    <div id="root" class="flex-grow flex flex-col">
      <?php include __DIR__ . '/components/header.php'; ?>
      
      <main class="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden py-32">
        <!-- Floating glassmorphic decorations -->
        <div class="absolute h-40 w-40 rounded-full bg-[#B9F1DA]/60 blur-3xl -left-10 top-20 z-0"></div>
        <div class="absolute h-60 w-60 rounded-full bg-[#C499F6]/40 blur-3xl right-10 bottom-10 z-0"></div>
        
        <div class="max-w-2xl w-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-3xl p-10 md:p-16 text-center z-10 relative">
          <div class="w-24 h-24 bg-[#7AE6B9]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p class="text-lg md:text-xl text-gray-700 mb-10 font-medium leading-relaxed">
            Your appointment request has been successfully submitted. Our team will review your details and get back to you shortly to confirm your booking.
          </p>
          <a href="/index.php" class="inline-block bg-[var(--blue-fig)] text-white font-semibold text-lg px-10 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-md">
            Return to Homepage
          </a>
        </div>
      </main>

      <?php include __DIR__ . '/components/footer.php'; ?>
    </div>
    
    <script src="/assets/interactive.js"></script>
  </body>
</html>

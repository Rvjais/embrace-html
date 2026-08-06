<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="utf-8" />
    <title>Gallery | eMbrace Lives</title>
    <link href="/Favicon.png" rel="icon" type="image/svg+xml" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta content="Explore the eMbrace Gallery featuring moments from our clinics, corporate workshops, and events." name="description" />
    <meta content="index, follow" name="robots" />
    <link href="https://embracelives.com/gallery.php" rel="canonical" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="index.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link crossorigin href="https://fonts.gstatic.com" rel="preconnect" />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
      rel="stylesheet"
    />
    <style>
      .masonry {
        column-count: 1;
        column-gap: 1.5rem;
      }
      @media (min-width: 640px) {
        .masonry { column-count: 2; }
      }
      @media (min-width: 1024px) {
        .masonry { column-count: 3; }
      }
      @media (min-width: 1280px) {
        .masonry { column-count: 4; }
      }
      .masonry-item {
        break-inside: avoid;
        margin-bottom: 1.5rem;
      }
      
      /* Lightbox styles */
      #lightbox {
        display: none;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(5px);
        align-items: center;
        justify-content: center;
      }
      #lightbox img {
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      }
      #lightbox-close {
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s;
      }
      #lightbox-close:hover {
        color: #ddd;
      }
    </style>
  </head>
  <body class="font-['DM_Sans'] antialiased text-[#403D3D]">
    <?php include __DIR__ . '/components/header.php'; ?>
    <?php include __DIR__ . '/components/mobile-header.php'; ?>

    <div class="relative w-full h-[300px] md:h-[400px] bg-[#E8F8F2] flex items-center justify-center overflow-hidden">
        <div class="text-center z-10">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#234394]">Our Gallery</h1>
            <p class="mt-4 text-lg md:text-xl text-[#403D3D] max-w-2xl mx-auto px-4">Moments from our clinics, corporate workshops, and events.</p>
        </div>
        <!-- Decorative blobs -->
        <div class="absolute w-32 h-32 bg-[#DC649D]/20 rounded-full top-10 left-[10%] blur-xl"></div>
        <div class="absolute w-40 h-40 bg-[#C499F6]/30 rounded-full bottom-10 right-[15%] blur-2xl"></div>
    </div>

    <div class="max-w-[95%] mx-auto py-12 md:py-20">
      
      <div class="text-center mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-[#234394]">Dr. Supriya & Team in Action</h2>
        <div class="w-16 h-1 bg-[#F5A962] mx-auto mt-4 rounded-full"></div>
      </div>
      
      <div class="masonry">

        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/IMG-20250324-WA0088.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/IMG-20250324-WA0088.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-37.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-37.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-38%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-38%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-38%203.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-38%203.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-38.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-38.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-39%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-39%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-39.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-03-11-20-14-39.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-33-41%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-33-41%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-33-41.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-33-41.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-48-47.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-48-47.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-49-02.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-49-02.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-49-16.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2023-05-20-16-49-16.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2024-11-08-13-47-15.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2024-11-08-13-47-15.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%2010.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%2010.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%2011.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%2011.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%203.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%203.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%204.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%204.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%205.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%205.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%206.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%206.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%207.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%207.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%208.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%208.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%209.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58%209.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-02-18-18-31-58.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-20-10-12-58.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-20-10-12-58.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%203.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%203.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%204.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%204.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%205.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%205.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%206.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-00%206.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-01.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-03-21-12-02-01.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-04-01-16-30-43%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-04-01-16-30-43%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-04-01-16-30-43.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-04-01-16-30-43.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-04-01-16-30-44.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-04-01-16-30-44.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-04-03-12-06-08.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-04-03-12-06-08.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-06-03-14-40-05.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-06-03-14-40-05.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-06-03-14-40-06%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-06-03-14-40-06%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-17.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-17.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-18%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-18%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-18%203.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-18%203.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-18.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-18.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-19%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-19%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-19.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-08-02-13-38-19.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-02-19-37-50%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-02-19-37-50%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-02-19-37-50%203.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-02-19-37-50%203.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-02-19-37-50%204.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-02-19-37-50%204.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-02-19-37-50.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-02-19-37-50.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-11-23-16-05%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-11-23-16-05%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-11-23-16-05%203.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-11-23-16-05%203.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-11-23-16-05%204.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-09-11-23-16-05%204.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-10-13-20-24-18.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-10-13-20-24-18.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-10-13-20-24-19%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-10-13-20-24-19%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-10-13-20-24-19.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2025-10-13-20-24-19.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%203.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%203.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%204.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%204.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%205.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%205.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%206.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13%206.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-01-03-20-22-13.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-02-18-09-44-22.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-02-18-09-44-22.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-02-25-14-14-26.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-02-25-14-14-26.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-02-25-14-14-27.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-02-25-14-14-27.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-03-27-14-55-34%202.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/PHOTO-2026-03-27-14-55-34%202.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/Bangalore%20The%20Rising/IMG_1525%20%281%29.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/Bangalore%20The%20Rising/IMG_1525%20%281%29.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/Bangalore%20The%20Rising/IMG_1539.jpg')">
          <img src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/Bangalore%20The%20Rising/IMG_1539.jpg" loading="lazy" alt="eMbrace Event" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
      </div>

      <div class="text-center mb-10 mt-20">
        <h2 class="text-2xl md:text-3xl font-bold text-[#234394]">Therapy Spaces</h2>
        <div class="w-16 h-1 bg-[#F5A962] mx-auto mt-4 rounded-full"></div>
      </div>
      
      <div class="masonry">

        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Client%20pictures-20260806T082433Z-1-001/Client%20pictures/IMG_2641.jpg')">
          <img src="/embrace-media/Client%20pictures-20260806T082433Z-1-001/Client%20pictures/IMG_2641.jpg" loading="lazy" alt="eMbrace Therapy Space" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
        <div class="masonry-item rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer" onclick="openLightbox('/embrace-media/Client%20pictures-20260806T082433Z-1-001/Client%20pictures/IMG_2642.jpg')">
          <img src="/embrace-media/Client%20pictures-20260806T082433Z-1-001/Client%20pictures/IMG_2642.jpg" loading="lazy" alt="eMbrace Therapy Space" class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-xl" />
        </div>
      </div>

    </div>

    <!-- Lightbox Modal -->
    <div id="lightbox" onclick="closeLightbox()">
      <span id="lightbox-close">&times;</span>
      <img id="lightbox-img" src="" alt="Full view" />
    </div>

    <?php include __DIR__ . '/components/footer.php'; ?>
    
    <script src="/assets/interactive.js"></script>
    <script>
      function openLightbox(url) {
        document.getElementById('lightbox-img').src = url;
        document.getElementById('lightbox').style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
      function closeLightbox() {
        document.getElementById('lightbox').style.display = 'none';
        document.body.style.overflow = 'auto';
      }
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
      });
    </script>
  </body>
</html>

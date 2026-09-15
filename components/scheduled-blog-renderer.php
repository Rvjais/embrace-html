<?php

if (!isset($article) || !is_array($article)) {
    http_response_code(500);
    exit;
}

$url = 'https://embracelives.com/blog/' . $article['slug'];
$faqSchema = [];
foreach ($article['faqs'] as $faq) {
    $faqSchema[] = ['@type'=>'Question','name'=>$faq[0],'acceptedAnswer'=>['@type'=>'Answer','text'=>$faq[1]]];
}
$schema = [
    '@context'=>'https://schema.org',
    '@graph'=>[
        ['@type'=>'BreadcrumbList','itemListElement'=>[
            ['@type'=>'ListItem','position'=>1,'name'=>'Home','item'=>'https://embracelives.com/'],
            ['@type'=>'ListItem','position'=>2,'name'=>'Blog','item'=>'https://embracelives.com/blog/'],
            ['@type'=>'ListItem','position'=>3,'name'=>$article['h1']],
        ]],
        ['@type'=>'BlogPosting','headline'=>$article['h1'],'url'=>$url,'datePublished'=>$article['date'],'dateModified'=>$article['date'],'inLanguage'=>'en-IN','author'=>['@type'=>'Organization','name'=>'eMbrace'],'reviewedBy'=>['@type'=>'Person','name'=>'Dr. Supriya Malik'],'publisher'=>['@type'=>'Organization','name'=>'eMbrace','url'=>'https://embracelives.com/'],'image'=>'https://embracelives.com/og-image.png','description'=>$article['description']],
        ['@type'=>'FAQPage','mainEntity'=>$faqSchema],
    ],
];
$published = DateTimeImmutable::createFromFormat('!Y-m-d', $article['date'], embrace_publication_timezone());
$publishedLabel = $published ? $published->format('j F Y') : $article['date'];
?>
<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <link href="/Favicon.png" rel="icon" type="image/svg+xml" />
  <meta content="<?= htmlspecialchars($article['description'], ENT_QUOTES) ?>" name="description" />
  <meta content="index, follow" name="robots" />
  <link href="<?= $url ?>" rel="canonical" />
  <meta content="article" property="og:type" />
  <meta content="<?= $url ?>" property="og:url" />
  <meta content="<?= htmlspecialchars($article['meta_title'], ENT_QUOTES) ?>" property="og:title" />
  <meta content="<?= htmlspecialchars($article['description'], ENT_QUOTES) ?>" property="og:description" />
  <meta content="https://embracelives.com/og-image.png" property="og:image" />
  <meta content="eMbrace Lives" property="og:site_name" />
  <meta content="en_IN" property="og:locale" />
  <meta content="<?= $article['date'] ?>" property="article:published_time" />
  <meta content="<?= htmlspecialchars($article['category'], ENT_QUOTES) ?>" property="article:section" />
  <title><?= htmlspecialchars($article['meta_title'], ENT_QUOTES) ?></title>
  <link href="/_external/fonts.googleapis.com/css2_4d2f350a.css" rel="stylesheet" />
  <link href="/assets/index-B-kGA3UA.css" rel="stylesheet" />
  <link href="/assets/lead-magnets.css" rel="stylesheet" />
  <style>
    .breadcrumbs{background:linear-gradient(to right,#f8fafc,#f1f5f9)}.breadcrumbs a{color:#234394}.article-content h2{color:#1e293b;font-weight:800;font-size:1.65rem;margin-top:2.5rem;margin-bottom:.75rem;letter-spacing:-.02em}.article-content h3{color:#334155;font-weight:700;font-size:1.25rem;margin-top:2rem;margin-bottom:.5rem}.article-content p{color:#475569;line-height:1.8;margin-bottom:1.25rem;font-size:1rem}.article-content a{color:#234394;font-weight:600;text-decoration:underline;text-underline-offset:2px}.article-content ul{list-style:none;padding-left:0;margin-bottom:1.5rem}.article-content li{position:relative;padding-left:1.75rem;margin-bottom:.9rem;color:#475569;line-height:1.7}.article-content li:before{content:"\25B8";position:absolute;left:0;color:#234394;font-weight:700}.article-content li strong{color:#1e293b}.author-card{display:flex;align-items:center;gap:1rem;background:#F9FBFF;border:1px solid #E0E6F0;border-radius:1.25rem;padding:1.25rem 1.5rem;margin-bottom:2rem}.author-card img{width:3.5rem;height:3.5rem;border-radius:9999px;object-fit:cover}.author-card .meta{font-size:.8rem;color:#64748b;line-height:1.6}.author-card strong{color:#234394;display:block;font-size:.9rem}.callout-card{background:linear-gradient(135deg,#eef2ff,#e0e7ff);border:1px solid #c7d2fe;border-radius:1.5rem;padding:2rem;margin:2rem 0}.safety-card{background:#FFF7ED;border:1px solid #FED7AA;border-left:4px solid #F59E0B;border-radius:1rem;padding:1.5rem;margin:2rem 0}.safety-card p,.callout-card p:last-child{margin-bottom:0}.faq-item{border-bottom:1px solid #e2e8f0}.faq-item button{padding:1.25rem 1rem}.faq-icon{width:1.5rem;height:1.5rem;flex-shrink:0;transition:transform .3s}.faq-icon.open{transform:rotate(45deg)}.cta-card{background:linear-gradient(135deg,#fef9e7,#fef3c7 50%,#fff8e1);border:1px solid #fde68a;border-radius:2rem;padding:2.5rem 2rem;text-align:center}.hero-tag{background:linear-gradient(135deg,#234394,#1e3a8a)!important;color:#fff!important}
  </style>
  <script type="application/ld+json"><?= json_encode($schema, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE) ?></script>
</head>
<body style="overflow:auto"><div id="root">
<?php include __DIR__ . '/header.php'; ?>
<div class="px-6 md:px-16 py-12 md:py-20 bg-gradient-to-b from-[#E7F7FF] to-white border-b border-[#E0E6F0]"><div class="max-w-4xl mx-auto text-center"><span class="inline-block px-5 py-1.5 text-xs font-bold rounded-full hero-tag mb-5 tracking-wider uppercase"><?= htmlspecialchars($article['tag']) ?></span><h1 class="text-3xl md:text-5xl font-extrabold text-[#234394] leading-tight mb-4"><?= $article['h1'] ?></h1><p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto italic"><?= $article['dek'] ?></p></div></div>
<div class="py-3 px-6 md:px-16 border-b border-gray-100 text-xs md:text-sm text-gray-500 breadcrumbs"><div class="max-w-7xl mx-auto flex items-center gap-2 flex-wrap"><a href="/">Home</a><span>/</span><a href="/blog/">Blog</a><span>/</span><span class="text-gray-800 font-medium"><?= htmlspecialchars($article['breadcrumb']) ?></span></div></div>
<div class="px-6 md:px-16 py-12 bg-white"><div class="max-w-3xl mx-auto article-content">
<div class="author-card"><img loading="lazy" decoding="async" width="375" height="392" alt="Dr. Supriya Malik, Founder of eMbrace" src="/embrace-media/Dr%20Supriya%20Photos-20260806T082436Z-1-001/Dr%20Supriya%20Photos/supriyaProfile.png" /><div class="meta"><strong>Reviewed by Dr. Supriya Malik</strong>Founder, eMbrace. 17+ years in psychology and developmental care.<br />Published <?= $publishedLabel ?></div></div>
<?= $article['body'] ?>
<h2>Frequently Asked Questions</h2><div class="space-y-2 mb-8">
<?php foreach ($article['faqs'] as $faq): ?><div class="faq-item"><button class="w-full text-left flex justify-between items-center faq-btn"><span class="font-semibold text-base md:text-lg text-[#234394]"><?= htmlspecialchars($faq[0]) ?></span><svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="#234394" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button><div class="transition-all duration-300 max-h-0 opacity-0 overflow-hidden"><p class="text-sm md:text-base text-gray-600 mt-2 pb-2 leading-relaxed"><?= htmlspecialchars($faq[1]) ?></p></div></div><?php endforeach; ?>
</div>
<div class="cta-card my-12"><h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-3"><?= $article['cta_title'] ?></h3><p class="text-sm md:text-base text-gray-600 mb-6 max-w-xl mx-auto"><?= $article['cta_text'] ?></p><a href="<?= $article['cta_url'] ?>" class="inline-block bg-[#234394] text-white px-8 py-3 rounded-full hover:bg-blue-800 font-semibold shadow"><?= $article['cta_label'] ?></a></div>
</div></div>
<?php include __DIR__ . '/lead-magnet-band-neuro.php'; ?>
<?php include __DIR__ . '/footer.php'; ?>
</div><script src="/assets/interactive.js"></script><script src="/assets/lead-magnets.js"></script></body></html>


'use client';

export function YandexMetrika() {
  return (
    <>
      {/* Yandex.Metrika counter */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=108584080', 'ym');

            ym(108584080, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src="https://mc.yandex.ru/watch/108584080"
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

export function YandexMetrikaInformer() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-slate-400">&copy; 2026 Delegon. Все права защищены.</p>

      {/* Yandex.Metrika informer */}
      <a
        href="https://metrika.yandex.ru/stat/?id=108584080&amp;from=informer"
        target="_blank"
        rel="nofollow"
        className="opacity-70 hover:opacity-100 transition-opacity"
      >
        <img
          src="https://informer.yandex.ru/informer/108584080/3_0_FFFFFFFF_EFEFEFFF_0_pageviews"
          style={{ width: '88px', height: '31px', border: 0 }}
          alt="Яндекс.Метрика"
          title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)"
          className="ym-advanced-informer"
          data-cid="108584080"
          data-lang="ru"
        />
      </a>
    </div>
  );
}

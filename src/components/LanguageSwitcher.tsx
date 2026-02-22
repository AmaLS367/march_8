import { useTranslation } from 'react-i18next';

const LOCALES = [
  { code: 'ru' as const, label: 'RU' },
  { code: 'en' as const, label: 'EN' },
  { code: 'hy' as const, label: 'HY' },
] as const;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = (i18n.language || 'ru').split('-')[0];

  return (
    <div className="flex rounded-full border border-border bg-background/80 p-0.5 shadow-sm">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          className={`min-w-[2.25rem] rounded-full px-2 py-1 text-sm font-medium transition-colors ${
            current === code
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title={
            code === 'ru'
              ? 'Русский'
              : code === 'en'
                ? 'English'
                : 'Հայերեն'
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

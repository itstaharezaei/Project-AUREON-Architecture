import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Info, Loader2, Mail, MapPin, Phone, X } from 'lucide-react'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { socialLinks, studioEmail, studioPhone, studioPhoneHref } from '@/data/site'
import { useLanguage } from '@/hooks/useLanguage'
import { cn } from '@/utils/cn'

type Status = 'idle' | 'sending' | 'success' | 'error'
type Field = 'name' | 'email' | 'subject' | 'message'

const emptyForm: Record<Field, string> = { name: '', email: '', subject: '', message: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function Contact() {
  const { t } = useLanguage()
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (): Partial<Record<Field, string>> => {
    const next: Partial<Record<Field, string>> = {}
    if (!values.name.trim()) next.name = t.contact.form.errors.required
    if (!values.email.trim()) next.email = t.contact.form.errors.required
    else if (!emailPattern.test(values.email.trim())) next.email = t.contact.form.errors.email
    if (!values.subject.trim()) next.subject = t.contact.form.errors.required
    if (values.message.trim().length < 20) next.message = t.contact.form.errors.messageShort
    return next
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    const firstInvalid = (Object.keys(nextErrors) as Field[])[0]
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('sending')
    await new Promise((resolve) => setTimeout(resolve, 900))
    if (!navigator.onLine) {
      setStatus('error')
      return
    }
    setStatus('success')
    setValues(emptyForm)
  }

  const update = (field: Field) => (event: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const fieldClass = (field: Field) =>
    cn(
      'w-full border-b bg-transparent py-3 text-base outline-none transition-colors duration-300 placeholder:text-muted/60 focus:border-accent',
      errors[field] ? 'border-accent' : 'border-line',
    )

  return (
    <section id="contact" className="relative bg-bg py-24 lg:py-32">
      <Container className="grid gap-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <SectionHeading
            index={t.contact.index}
            eyebrow={t.contact.eyebrow}
            title={t.contact.title}
            lead={t.contact.lead}
          />

          <ScrollReveal className="mt-12">
            {status === 'success' && (
              <div
                role="status"
                className="mb-8 flex items-start gap-4 border border-accent/40 bg-accent-soft p-5"
              >
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
                <div className="flex flex-col gap-1">
                  <p className="font-bold">{t.contact.form.successTitle}</p>
                  <p className="text-sm leading-relaxed text-muted">{t.contact.form.successBody}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  aria-label={t.a11y.closeMenu}
                  className="ms-auto text-muted transition-colors hover:text-accent"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
            )}

            {status === 'error' && (
              <div role="alert" className="mb-8 border border-accent/40 bg-accent-soft p-5">
                <p className="font-bold">{t.contact.form.errorTitle}</p>
                <p className="mt-1 text-sm text-muted">{t.contact.form.errorBody}</p>
              </div>
            )}

            <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-7 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="eyebrow">
                  {t.contact.form.name}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={update('name')}
                  placeholder={t.contact.form.namePlaceholder}
                  aria-invalid={Boolean(errors.name)}
                  className={fieldClass('name')}
                />
                {errors.name && <p className="text-xs text-accent">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="eyebrow">
                  {t.contact.form.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  value={values.email}
                  onChange={update('email')}
                  placeholder={t.contact.form.emailPlaceholder}
                  aria-invalid={Boolean(errors.email)}
                  className={cn(fieldClass('email'), 'text-start')}
                />
                {errors.email && <p className="text-xs text-accent">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="contact-subject" className="eyebrow">
                  {t.contact.form.subject}
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={values.subject}
                  onChange={update('subject')}
                  placeholder={t.contact.form.subjectPlaceholder}
                  aria-invalid={Boolean(errors.subject)}
                  className={fieldClass('subject')}
                />
                {errors.subject && <p className="text-xs text-accent">{errors.subject}</p>}
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="contact-message" className="eyebrow">
                  {t.contact.form.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={update('message')}
                  placeholder={t.contact.form.messagePlaceholder}
                  aria-invalid={Boolean(errors.message)}
                  className={cn(fieldClass('message'), 'resize-y')}
                />
                {errors.message && <p className="text-xs text-accent">{errors.message}</p>}
              </div>

              <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                <Button type="submit" disabled={status === 'sending'} withArrow={false}>
                  {status === 'sending' ? (
                    <span className="flex items-center gap-3">
                      <Loader2 aria-hidden className="size-4 animate-spin" />
                      {t.contact.form.sending}
                    </span>
                  ) : (
                    t.contact.form.submit
                  )}
                </Button>
                <p className="flex items-center gap-2 text-xs text-muted">
                  <Info aria-hidden className="size-4 shrink-0 text-accent" />
                  {t.contact.form.demoNote}
                </p>
              </div>
            </form>
          </ScrollReveal>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-5 lg:pt-24">
          <ScrollReveal>
            <div className="flex flex-col gap-6 border border-line bg-surface p-8 sm:p-10">
              <h3 className="eyebrow">{t.contact.info.title}</h3>
              <ul className="flex flex-col gap-5 text-sm">
                <li className="flex items-start gap-4">
                  <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="flex flex-col gap-1">
                    <span className="eyebrow">{t.contact.info.emailLabel}</span>
                    <a href={`mailto:${studioEmail}`} className="link-underline font-semibold hover:text-accent" dir="ltr">
                      {studioEmail}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="flex flex-col gap-1">
                    <span className="eyebrow">{t.contact.info.phoneLabel}</span>
                    <a href={studioPhoneHref} className="link-underline font-semibold hover:text-accent" dir="ltr">
                      {studioPhone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="flex flex-col gap-1">
                    <span className="eyebrow">{t.contact.info.addressLabel}</span>
                    <span className="font-semibold">{t.contact.info.address}</span>
                  </span>
                </li>
              </ul>
              <p className="border-t border-line pt-5 text-xs text-muted">
                {t.contact.info.hoursLabel} — {t.contact.info.hours}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <h3 className="eyebrow">{t.contact.socialTitle}</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-full border border-line px-5 py-2.5 text-xs font-bold tracking-[0.16em] uppercase transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    {social.id}
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
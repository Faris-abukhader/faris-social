import i18n from '@faris/utils/i18n.config'

export default function fromNow(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor(seconds / 2592000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60);

  if (days > 548) {
    return i18n.t('yearsAgo',{value:years})
  }
  if (days >= 320 && days <= 547) {
    return i18n.t('ayearAgo')
  }
  if (days >= 45 && days <= 319) {
    return i18n.t('monthsAgo',{value:months})
  }
  if (days >= 26 && days <= 45) {
    return i18n.t('amonthAgo')
  }
  if (hours >= 36 && days <= 25) {
    return i18n.t('daysAgo',{value:days})
  }
  if (hours >= 22 && hours <= 35) {
    return i18n.t('adayAgo')
  }
  if (minutes >= 90 && hours <= 21) {
    return i18n.t('hoursAgo',{value:hours})
  }
  if (minutes >= 45 && minutes <= 89) {
    return i18n.t('ahourAgo')
  }
  if (seconds >= 90 && minutes <= 44) {
    return i18n.t('minutesAgo',{value:minutes})
  }
  if (seconds >= 45 && seconds <= 89) {
    return i18n.t('aminuteAgo')
  }
  if (seconds >= 0 && seconds <= 45) {
    return i18n.t('secondsAgo')
  }
}
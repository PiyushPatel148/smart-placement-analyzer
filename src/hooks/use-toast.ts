import * as React from "react"

type ToastProps = {
  title?: string
  description?: string
}

type Toast = ToastProps & {
  id: string
}

type ToastState = {
  toasts: Toast[]
}

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

const toastState: ToastState = {
  toasts: [],
}

const listeners: Array<(state: ToastState) => void> = []

function emitChange() {
  listeners.forEach((listener) => listener(toastState))
}

function addToast(toast: Toast) {
  toastState.toasts = [toast, ...toastState.toasts].slice(0, TOAST_LIMIT)
  emitChange()
}

function removeToast(id: string) {
  toastState.toasts = toastState.toasts.filter((t) => t.id !== id)
  emitChange()
}

export function toast(props: ToastProps) {
  const id = Math.random().toString(36).slice(2)

  addToast({ id, ...props })

  setTimeout(() => {
    removeToast(id)
  }, TOAST_REMOVE_DELAY)
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(toastState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
  }
}

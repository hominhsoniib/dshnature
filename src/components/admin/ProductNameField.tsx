'use client'

import { useEffect, useId, useState } from 'react'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  useConfig,
  useField,
  useFormFields,
} from '@payloadcms/ui'
import type { TextFieldClientComponent, Validate } from 'payload'

/**
 * Field "Tên sản phẩm" (Products.name) với gợi ý autocomplete từ các sản
 * phẩm ĐÃ TỒN TẠI trong cùng danh mục (Products.category) đang chọn — giúp
 * tránh trùng lặp/đặt tên không nhất quán. Vẫn là text input tự do, KHÔNG
 * giới hạn phải chọn từ gợi ý (dùng <datalist> gốc của trình duyệt, không
 * chặn gõ tên mới).
 */
export const ProductNameField: TextFieldClientComponent = ({ field, path, readOnly, validate }) => {
  const { config } = useConfig()
  // Bọc lại validate qua 1 callback khớp type Validate<string> chung mà
  // useField() kỳ vọng (thay vì TextFieldValidation hẹp hơn của prop gốc) —
  // cùng cách tiếp cận TextField.js gốc của Payload làm.
  const wrappedValidate: Validate<string> = (value, options) => {
    if (typeof validate === 'function') {
      return validate(value, { ...options, required: field.required } as Parameters<NonNullable<typeof validate>>[1])
    }
    return true
  }
  const { errorMessage, setValue, showError, value } = useField<string>({ path, validate: wrappedValidate })
  const categoryId = useFormFields(([fields]) => {
    const raw = fields?.category?.value
    if (typeof raw === 'string') return raw
    if (raw && typeof raw === 'object' && 'id' in raw) return String((raw as { id: unknown }).id)
    return undefined
  })

  const [suggestions, setSuggestions] = useState<string[]>([])
  const datalistId = useId()

  useEffect(() => {
    if (!categoryId) {
      return
    }

    const controller = new AbortController()
    // Debounce nhẹ — tránh gọi API liên tục khi categoryId đổi dồn dập
    // (vd. đang gõ trong 1 field relationship dạng search-select khác).
    const timer = setTimeout(() => {
      const apiRoute = config.routes?.api || '/api'
      const url =
        `${config.serverURL || ''}${apiRoute}/products` +
        `?where[category][equals]=${encodeURIComponent(categoryId)}` +
        `&limit=50&depth=0&select[name]=true`

      fetch(url, { credentials: 'include', signal: controller.signal })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { docs?: Array<{ name?: string }> } | null) => {
          if (!data?.docs) return
          const names = Array.from(
            new Set(
              data.docs
                .map((doc) => doc.name)
                .filter((name): name is string => typeof name === 'string' && name.length > 0),
            ),
          )
          setSuggestions(names)
        })
        .catch(() => {
          // Best-effort — lỗi mạng/API không được chặn việc gõ tên sản phẩm.
        })
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [categoryId, config.routes?.api, config.serverURL])

  const inputId = `field-${path.replace(/\./g, '__')}`
  // Không xóa suggestions cũ đồng bộ trong effect (tránh setState đồng bộ
  // ngay khi effect chạy) — chỉ hiển thị gợi ý khi đang có category chọn.
  const visibleSuggestions = categoryId ? suggestions : []

  return (
    <div className={['field-type', 'text', showError && 'error', readOnly && 'read-only'].filter(Boolean).join(' ')}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div className="field-type__wrap">
        <FieldError message={errorMessage} path={path} showError={showError} />
        <input
          id={inputId}
          list={visibleSuggestions.length > 0 ? datalistId : undefined}
          name={path}
          onChange={(e) => setValue(e.target.value)}
          readOnly={readOnly}
          required={field.required}
          type="text"
          value={value ?? ''}
        />
        {visibleSuggestions.length > 0 ? (
          <datalist id={datalistId}>
            {visibleSuggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        ) : null}
        <FieldDescription description={field.admin?.description} path={path} />
      </div>
    </div>
  )
}

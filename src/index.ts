export interface Input<T> {
  and?: T[]
  or?: T[]
  not?: T[]
}

export type BooleanInput = Input<boolean>
export type LazyInput = Input<() => boolean>
export type LazyAsyncInput = Input<() => Promise<boolean>>

export const aon = (input: BooleanInput): boolean => {
  if (
    (!input.and || input.and.length === 0) &&
    (!input.or || input.or.length === 0) &&
    (!input.not || input.not.length === 0)
  ) {
    return false
  }

  let res: boolean = true
  if (input.and && input.and.length > 0) {
    res = res && !input.and.some((p) => !p)
    if (!res) return false
  }

  if (input.or && input.or.length > 0) {
    res = res && input.or.some((p) => p)
    if (!res) return false
  }

  if (input.not && input.not.length > 0) {
    res = res && !input.not.some((p) => p)
    if (!res) return false
  }

  return res
}

export const lazyAon = (input: LazyInput): boolean => {
  if (
    (!input.and || input.and.length === 0) &&
    (!input.or || input.or.length === 0) &&
    (!input.not || input.not.length === 0)
  ) {
    return false
  }

  // check and
  if (input.and && input.and.length > 0) {
    for (const pf of input.and) {
      const p = pf()
      if (typeof p !== 'boolean') {
        throw new Error('invalid input')
      }
      if (!p) {
        return false
      }
    }
  }

  // check not
  if (input.not && input.not.length > 0) {
    for (const pf of input.not) {
      const p = pf()
      if (typeof p !== 'boolean') {
        throw new Error('invalid input')
      }
      if (p) {
        return false
      }
    }
  }

  // check or
  if (input.or && input.or.length > 0) {
    for (const pf of input.or) {
      const p = pf()
      if (typeof p !== 'boolean') {
        throw new Error('invalid input')
      }
      if (p) {
        return true
      }
    }

    return false
  }

  return true
}

export const lazyAonAsync = async (input: LazyAsyncInput): Promise<boolean> => {
  if (
    (!input.and || input.and.length === 0) &&
    (!input.or || input.or.length === 0) &&
    (!input.not || input.not.length === 0)
  ) {
    return false
  }

  // check and
  if (input.and && input.and.length > 0) {
    for (const pf of input.and) {
      const p = await pf()
      if (typeof p !== 'boolean') {
        throw new Error('invalid input')
      }
      if (!p) {
        return false
      }
    }
  }

  // check not
  if (input.not && input.not.length > 0) {
    for (const pf of input.not) {
      const p = await pf()
      if (typeof p !== 'boolean') {
        throw new Error('invalid input')
      }
      if (p) {
        return false
      }
    }
  }

  // check or
  if (input.or && input.or.length > 0) {
    for (const pf of input.or) {
      const p = await pf()
      if (typeof p !== 'boolean') {
        throw new Error('invalid input')
      }
      if (p) {
        return true
      }
    }

    return false
  }

  return true
}

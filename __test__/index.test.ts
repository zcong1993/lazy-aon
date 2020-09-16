import {
  BooleanInput,
  LazyAsyncInput,
  LazyInput,
  lazyAon,
  aon,
  lazyAonAsync,
} from '../src'

const generateTestcase = () => {
  const cases: boolean[][] = [
    [],
    [true],
    [false],
    [true, false],
    [false, true],
    [true, true],
    [false, false],
  ]
  const keys = ['and', 'or', 'not']

  const res: BooleanInput[] = []
  let i = 0
  while (i < 10000) {
    let a: any = {}
    for (const k of keys) {
      a[k] = cases[Math.floor(Math.random() * cases.length)]
    }
    res.push(a)
    i++
  }

  return res
}

it('lazyAon should work well', () => {
  const cases = generateTestcase()

  for (const c of cases) {
    const lc: LazyInput = {}
    lc.and = c.and.map((a) => (a ? () => true : () => false))
    lc.or = c.or.map((a) => (a ? () => true : () => false))
    lc.not = c.not.map((a) => (a ? () => true : () => false))

    expect(lazyAon(lc)).toBe(aon(c))
  }
})

it('lazyAonAsync should work well', async () => {
  const cases = generateTestcase()

  for (const c of cases) {
    const lc: LazyAsyncInput = {}
    lc.and = c.and.map((a) =>
      a ? () => Promise.resolve(true) : () => Promise.resolve(false)
    )
    lc.or = c.or.map((a) =>
      a ? () => Promise.resolve(true) : () => Promise.resolve(false)
    )
    lc.not = c.not.map((a) =>
      a ? () => Promise.resolve(true) : () => Promise.resolve(false)
    )

    lazyAonAsync(lc).then((r) => {
      expect(r).toBe(aon(c))
    })
  }
})

it('test null input', async () => {
  expect(aon({})).toBeFalsy()
  expect(lazyAon({})).toBeFalsy()
  expect(await lazyAonAsync({})).toBeFalsy()
})

it('test invalid input', async () => {
  expect(() =>
    lazyAon({
      and: [(() => 'a') as any],
    })
  ).toThrow()

  expect(() =>
    lazyAon({
      or: [(() => 'a') as any],
    })
  ).toThrow()

  expect(() =>
    lazyAon({
      not: [(() => 'a') as any],
    })
  ).toThrow()

  await expect(
    lazyAonAsync({
      and: [(() => 'a') as any],
    })
  ).rejects.toThrow()

  await expect(
    lazyAonAsync({
      or: [(() => 'a') as any],
    })
  ).rejects.toThrow()

  await expect(
    lazyAonAsync({
      not: [(() => 'a') as any],
    })
  ).rejects.toThrow()
})

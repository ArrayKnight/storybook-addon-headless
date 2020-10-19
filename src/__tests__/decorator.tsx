import { createFilteredRecord } from '../decorator'

describe('createFilteredRecord', () => {
    it('should create a record with entries filtered by keys passed', () => {
        expect(
            createFilteredRecord(['foo'], { foo: true, bar: false }, false),
        ).toEqual({ foo: true })
    })

    it('should add keys with a default value when missing', () => {
        expect(
            createFilteredRecord(['foo', 'wux'], { foo: 17, bar: -3 }, 0),
        ).toEqual({ foo: 17, wux: 0 })
    })
})

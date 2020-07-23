import { convertToItem } from './utilities'

describe('convertToItem', () => {
    it('should value to item', () => {
        expect(convertToItem(true)).toEqual({
            label: 'True',
            value: true,
        })
    })
})

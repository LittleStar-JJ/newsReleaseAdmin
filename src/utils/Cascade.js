/**
 * Created by xwatson on 2017/2/24.
 */

export default class Cascade {
    static getArea(area, value, result) {
        if (area) {
            const _v = value.shift()
            area.forEach((item) => {
                if (item.value === _v) {
                    result = result || []
                    result.push(item)
                    if (item.children) {
                        this.getArea(item.children, value, result)
                    } else {
                        return false
                    }
                }
            })
            return result
        } else {
            return null
        }
    }
}

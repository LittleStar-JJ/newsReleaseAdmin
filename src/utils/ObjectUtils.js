/**
 * Created by leeqj on 16/4/29.
 */

export default class ObjectUtils {
    static validateFiled = (obj, requiredFields = []) => {
        return (obj && requiredFields.every(key => obj.hasOwnProperty(key)))
    }

    static clone = (myObj = {}) => {
        if (typeof (myObj) !== 'object' || myObj == null) return myObj
        var newObj = {}
        for (var i in myObj) {
            newObj[i] = ObjectUtils.clone(myObj[i])
        }
        return newObj
    }
}

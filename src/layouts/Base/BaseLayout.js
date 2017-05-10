/**
 * Created by xwatson on 2016/12/28.
 */
import React from 'react'

export default class BaseLayout extends React.Component {
    constructor(props) {
        super(props)
        this.changeLocale = this.changeLocale.bind(this)
    }
    changeLocale(e) {
    }
    /**
     * 递归菜单结构
     * @param menus 菜单数据
     */
    recursiveMenu = (menus) => {
        const firstMenu = menus.filter((item) => item.parent_id === 0)
        firstMenu.map((item, i) => {
            item.key = `${i}`
            this.setMenusData(item.id, item, menus)
        })
        return firstMenu
    }
    setMenusData = (id, firstMenu, menus) => {
        const find = menus.filter((v) => {
            return id === v.parent_id
        })
        if (find.length) {
            find.map((f) => {
                f.key = `${firstMenu.key}-${f.id}`
                firstMenu.child = find
                this.setMenusData(f.id, f, menus)
            })
        }
    }
}

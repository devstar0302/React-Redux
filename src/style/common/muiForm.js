import { errorColor, textColor, primeColor, backgroundColor, headerColor } from './muiColor'
import { fontSize, smallFontSize } from './muiFont'

export const errorStyle = {
    color: errorColor
}

export const inputStyle = {
    color: textColor,
    fontSize: fontSize
}

export const smallInputStyle = {
    color: textColor,
    fontSize: smallFontSize
}

export const underlineStyle = {
    borderColor: primeColor
}

export const selectedItemStyle = {
    color: primeColor
}

export const headerStyle = {
    backgroundColor: backgroundColor,
    color: headerColor
}

export const subHeaderStyle = {
    color: primeColor,
    fontSize: fontSize,
    // wordBreak: 'break-all',
    paddingTop: 48
}

export const underlineFocusStyle = {

}

export const dialogBodyStyle = {
    background: '#efefef',
    padding: '0 0 20px 0',
    overflowY: 'auto'
}
export const dialogTitleStyle = {
    background: '#324454',
    color: 'white',
    fontSize: 14,
    padding: '12px 24px',
    margin: 0
}
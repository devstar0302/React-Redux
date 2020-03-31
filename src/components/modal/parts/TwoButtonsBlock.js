import React from 'react'
import TwoButtonsBlockCustom from './TwoButtonsBlockCustom'

const TwoButtonsBlock = ({onSave, onClose}) => (
  <TwoButtonsBlockCustom action1={onSave} action2={onClose} name1="Save" name2="Close"/>
)
export default TwoButtonsBlock

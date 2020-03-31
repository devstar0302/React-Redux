import React from 'react'

const LineTypesMenu = ({ popover, cover, toggle, lineTypes, onChoose }) => (
  <div style={popover}>
    <div style={cover} onClick={toggle}/>
    <div id="linetypediv" className="panel-group">
      <ul>
        {
          lineTypes.map(item =>
            <li key={item.type} className={item.visible ? 'link' : 'hidden'} onClick={onChoose.bind(this, item)}>
              <div className="pull-left item-icon">
                <img src={item.image} data-type={item.type} alt=""/>
              </div>
              <div className="item-text">
                <strong>{item.title}</strong>
              </div>
            </li>
          )
        }
      </ul>
    </div>
  </div>
)

export default LineTypesMenu

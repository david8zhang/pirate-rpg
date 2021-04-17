export const itemStats = (stat, value) => {
  return (
    <div style={{ fontFamily: 'GraphicPixel', fontSize: '9px', color: 'white' }}>
      <span style={{ marginRight: '5px', margin: '0px' }}>
        {stat.slice(0, 1).toUpperCase()}
        {stat.slice(1)}: {value}
      </span>
    </div>
  )
}

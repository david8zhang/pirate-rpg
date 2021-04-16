export const ItemStats = (stats) => {
  return stats.forEach((stat) => {
    return (
      <div style={{ display: 'flex', fontFamily: 'GraphicPixel' }}>
        <p style={{ marginRight: '5px' }}>{stat.name}</p>
        <p>{stat.value}</p>
      </div>
    )
  })
}

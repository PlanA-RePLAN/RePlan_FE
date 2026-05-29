interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onChange(!checked)
      }}
      style={{
        display: 'flex',
        width: '60px',
        padding: '2px',
        justifyContent: checked ? 'flex-end' : 'flex-start',
        alignItems: 'center',
        borderRadius: '100px',
        background: checked ? '#202021' : '#D1D5DB',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          background: '#FFFFFF',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      />
    </div>
  )
}

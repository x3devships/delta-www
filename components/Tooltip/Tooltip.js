// import { Popper, Target, Manager } from 'react-popper';
import { usePopperTooltip } from 'react-popper-tooltip';

const Tooltip = ({tip, inline}) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
  	placement: 'top'
  });

	if (!tip) {
		return null;
	}

	const vis = visible;
  const dropdown = vis ? 
    <div key={2}
      ref={setTooltipRef}
      {...getTooltipProps({ className: 'tooltip-container' })}
    >
      {typeof tip === 'function' ? tip() : tip}
      <div {...getArrowProps({ className: 'tooltip-arrow' })} />
    </div> : null;

  return [
  	<div key={1} className='tooltip-trigger' style={{display: inline ? 'inline-flex' : undefined}}>
		  <div className='tooltip-circle' ref={setTriggerRef} >
		  	<div className='tooltip-question'>?</div>
		  </div>
	  </div>,
	  dropdown
  ];
}

export default Tooltip;

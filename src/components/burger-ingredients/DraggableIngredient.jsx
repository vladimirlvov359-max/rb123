import { useDrag } from 'react-dnd';

const DraggableIngredient = ({ ingredient, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ingredient.type === 'bun' ? 'bun' : 'ingredient',
    item: () => {
      return ingredient;
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default DraggableIngredient;

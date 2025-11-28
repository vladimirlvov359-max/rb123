import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import style from './burger-card.module.css';

export function BurgerCard(props) {
  const buns = props.ingredients.filter((ingredient) => ingredient.type === 'bun');
  const sauces = props.ingredients.filter((ingredient) => ingredient.type === 'sauce');
  const mains = props.ingredients.filter((ingredient) => ingredient.type === 'main');

  return (
    <div>
      <ul className={`${style.main} custom-scroll `}>
        <div>
          <div className="text text_type_main-large">Булки</div>
          <div className={style.verticalBlock}>
            {buns.map((bun) => (
              <li key={bun._id} className={style.column}>
                {<img src={bun.image} alt="bun" />}
                <div className={style.price_cristal}>
                  <div className="text text_type_digits-default">{bun.proteins}</div>
                  <div>
                    <CurrencyIcon type="primary" />
                  </div>
                </div>
                <div className={`text text_type_main-default ${style.name}`}>
                  {bun.name}
                </div>
              </li>
            ))}
          </div>
        </div>

        <div>
          <div className={`text text_type_main-large`}>Соусы</div>
          <div className={style.verticalBlock}>
            {sauces.map((sauce) => (
              <li key={sauce._id} className={`pl-1 pr-1 pb-1 pt-1 ${style.column}`}>
                {<img src={sauce.image} alt="sauce" />}
                <div className={style.price_cristal}>
                  <div className="text text_type_digits-default">{sauce.proteins}</div>
                  <div>
                    <CurrencyIcon type="primary" />
                  </div>
                </div>
                <div className={`text text_type_main-default ${style.name}`}>
                  {sauce.name}
                </div>
              </li>
            ))}
          </div>
        </div>

        <div>
          <div className="text text_type_main-large">Начинки</div>
          <div className={style.verticalBlock}>
            {mains.map((main) => (
              <li key={main._id} className={`pl-1 pr-1 pb-1 pt-1 ${style.column}`}>
                {<img src={main.image} alt="main" />}
                <div className={style.price_cristal}>
                  <div className="text text_type_digits-default">{main.proteins}</div>
                  <div>
                    <CurrencyIcon type="primary" />
                  </div>
                </div>
                <div className={`text text_type_main-default ${style.name}`}>
                  {main.name}
                </div>
              </li>
            ))}
          </div>
        </div>
      </ul>
    </div>
  );
}

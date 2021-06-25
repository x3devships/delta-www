import { useContext, useState } from 'react';
import { useWallet } from 'use-wallet';
import { useRouter } from 'next/router'
import { ModalContext } from '../../contexts';
import { useWeb3 } from '../../hooks';
import logo from '../../public/HeaderLogo.svg';

const shortenAddress = address => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const NavBar = () => {
  const wallet = useWallet();
  const modalContext = useContext(ModalContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter()
  const web3 = useWeb3();

  const renderMenuItems = () => {
    const getStyle = (prependStyle, href) => {
      const baseStyle = 'block px-3 py-2 rounded-none text-small font-medium topbar-dyn-fontsz';

      if (router.pathname === href) { // selected item
        return `${prependStyle} ${baseStyle} bg-gray-700 text-white`;
      }

      return `${prependStyle} ${baseStyle} text-gray-300 block hover:text-white hover:bg-gray-700`;
    }
    return <>
      <a href="/" className={getStyle('menu-link menu-link-home ', '/')}>Home</a>
      <a href="/vault" className={getStyle('menu-link menu-link-vault ', '/vault')}>Vault</a>
      <a href="/contracts" className={getStyle('menu-link menu-link-contracts ', '/contracts')}>Withdrawal contracts</a>
      <a href="/contracts" className={getStyle('menu-link menu-link-contracts-small ', '/contracts')}>Contracts</a>
      <a href="/faq" className={getStyle('menu-link menu-link-faq ', '/faq')}>FAQ</a>
    </>;
  };

  const renderTokenIcon = ({tokenLogo, onClick}) =>
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={onClick} className="hidden sm:inline-block rounded-md bg-dark-900 hover:bg-dark-800 p-0.5 cursor-pointer" style={{width: '36px', height: '36px', background: 'white', display: 'flex', placeItems: 'center', justifyContent: 'center'}}>
      {typeof tokenLogo === 'string' ?
          <img className="rounded-md object-contain" style={{width: '24px', height: '24px'}} alt="add token" src={tokenLogo} /> :
            typeof tokenLogo === 'function' ?
              tokenLogo() :
                null}
    </div>;

  const renderAddDeltaToken = () => {
    const tokenLogo = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAACqCAYAAAD4BE4TAAAK2GlDQ1BJQ0MgUHJvZmlsZQAASImVlwdUU9kWhs+96Y0WiICU0DvSCSAl9FAE6SAqIQlJKCEkBBWxIYMjOBZURLCM6IiIgqMjIGNBLFgYBBv2CTIoqONgwYbK3MAjzMxb77319lon51s7++yz98m5d/0BgBLKFouzYTUAckT5kpgQf3pScgodNwjQwACQgD5wZnOkYmZ0dARAbGr+u727DSDFfMNOkevfv/+vpsHlSTkAQKkIp3OlnByE25HxjCOW5AOAOoT4TRblixXcg7CmBCkQ4d8UzJ/kDwpOn2A0eSImLiYAYToAeDKbLeEDQLZF/PQCDh/JQ1b04CDiCkUIFyHswxGwuQifRNg2JydXwUMIWyLxYgAoyOkARvpfcvL/lj9dmZ/N5it5sq8JwwcKpeJs9pL/82j+t+Vky6b2MEcGWSAJjVHsh5zfnazccCWL0udETbGQO1mTggWy0Pgp5kgDUqaYyw4MV67NnhMxxRnCYJYyTz4rbop50qDYKZbkxij3ypAEMKeYLZnYl4iwXJYVr/QLeCxl/kJBXOIUFwgT5kyxNCs2fDomQOmXyGKU9fNEIf7T+wYre8+R/qVfIUu5Nl8QF6rsnT1dP0/EnM4pTVLWxuUFBk3HxCvjxfn+yr3E2dHKeF52iNIvLYhVrs1HLuf02mjlGWayw6KnGAhBJGADDl11igDI5y3OVzQSkCteIhHyBfl0JvK08egsEcfelu7k4OQIgOLZnbwOb2gTzyREuzLty2sHwKMMcfKnfWwTAE48AYD6btpn8hq5ShsBONXDkUkKJn1oxQcG+fVUgSbQQd4NJsAS2AEn4Aa8gB8IAmEgCsSBZLAAqVUAcoAELAJFYBUoBeVgI9gKqsFusBccAIfBUdACToKz4CK4CnrALXAfyMEgeA5GwDswBkEQDqJAVEgHMoTMIBvICWJAPlAQFAHFQMlQGsSHRJAMKoJWQ+VQBVQN7YHqoR+hE9BZ6DLUC92F+qFh6DX0CUbBZFgT1ofN4VkwA2bC4XAcPB/mw3lwIVwCr4er4Fr4ENwMn4WvwrdgOfwcHkUBFAlFQxmh7FAMVAAqCpWCykBJUMtRZahKVC2qEdWG6kTdQMlRL1Af0Vg0FU1H26G90KHoeDQHnYdejl6HrkYfQDejz6NvoPvRI+ivGApGD2OD8cSwMEkYPmYRphRTidmPOY65gLmFGcS8w2KxNKwF1h0bik3GZmKXYtdhd2KbsO3YXuwAdhSHw+ngbHDeuCgcG5ePK8Vtxx3CncFdxw3iPuBJeEO8Ez4Yn4IX4YvxlfiD+NP46/in+DGCGsGM4EmIInAJSwgbCPsIbYRrhEHCGFGdaEH0JsYRM4mriFXERuIF4gPiGxKJZEzyIM0lCUkrSVWkI6RLpH7SR7IG2ZocQE4ly8jryXXkdvJd8hsKhWJO8aOkUPIp6yn1lHOUR5QPKlQVexWWCldlhUqNSrPKdZWXqgRVM1Wm6gLVQtVK1WOq11RfqBHUzNUC1Nhqy9Vq1E6o9amNqlPVHdWj1HPU16kfVL+sPqSB0zDXCNLgapRo7NU4pzFARVFNqAFUDnU1dR/1AnVQE6tpocnSzNQs1zys2a05oqWh5aKVoLVYq0brlJachqKZ01i0bNoG2lHabdqnGfozmDN4M9bOaJxxfcZ77Znafto87TLtJu1b2p906DpBOlk6m3RadB7qonWtdefqLtLdpXtB98VMzZleMzkzy2YenXlPD9az1ovRW6q3V69Lb1TfQD9EX6y/Xf+c/gsDmoGfQabBFoPTBsOGVEMfQ6HhFsMzhs/oWnQmPZteRT9PHzHSMwo1khntMeo2GjO2MI43LjZuMn5oQjRhmGSYbDHpMBkxNTSNNC0ybTC9Z0YwY5gJzLaZdZq9N7cwTzRfY95iPmShbcGyKLRosHhgSbH0tcyzrLW8aYW1YlhlWe206rGGrV2tBdY11tdsYBs3G6HNTpteW4yth63Itta2z45sx7QrsGuw67en2UfYF9u32L+cZTorZdamWZ2zvjq4OmQ77HO476jhGOZY7Njm+NrJ2onjVON005niHOy8wrnV+ZWLjQvPZZfLHVeqa6TrGtcO1y9u7m4St0a3YXdT9zT3He59DE1GNGMd45IHxsPfY4XHSY+Pnm6e+Z5HPf/wsvPK8jroNTTbYjZv9r7ZA97G3mzvPd5yH7pPms/3PnJfI1+2b63vYz8TP67ffr+nTCtmJvMQ86W/g7/E/7j/+wDPgGUB7YGowJDAssDuII2g+KDqoEfBxsH84IbgkRDXkKUh7aGY0PDQTaF9LH0Wh1XPGglzD1sWdj6cHB4bXh3+OMI6QhLRFglHhkVujnwwx2yOaE5LFIhiRW2OehhtEZ0X/fNc7NzouTVzn8Q4xhTFdMZSYxfGHox9F+cftyHufrxlvCy+I0E1ITWhPuF9YmBiRaI8aVbSsqSrybrJwuTWFFxKQsr+lNF5QfO2zhtMdU0tTb0932L+4vmXF+guyF5waqHqQvbCY2mYtMS0g2mf2VHsWvZoOit9R/oIJ4CzjfOc68fdwh3mefMqeE8zvDMqMob43vzN/GGBr6BS8EIYIKwWvsoMzdyd+T4rKqsuazw7MbspB5+TlnNCpCHKEp3PNchdnNsrthGXiuV5nnlb80Yk4ZL9Ukg6X9qar4mIpC6ZpewbWX+BT0FNwYdFCYuOLVZfLFrctcR6ydolTwuDC39Yil7KWdpRZFS0qqh/GXPZnuXQ8vTlHStMVpSsGFwZsvLAKuKqrFW/FDsUVxS/XZ24uq1Ev2RlycA3Id80lKqUSkr71nit2f0t+lvht91rndduX/u1jFt2pdyhvLL88zrOuivfOX5X9d34+oz13RvcNuzaiN0o2nh7k++mAxXqFYUVA5sjNzdvoW8p2/J268KtlytdKndvI26TbZNXRVS1bjfdvnH752pB9a0a/5qmHXo71u54v5O78/ouv12Nu/V3l+/+9L3w+zt7QvY015rXVu7F7i3Y+2Rfwr7OHxg/1O/X3V++/0udqE5+IObA+Xr3+vqDegc3NMANsobhQ6mHeg4HHm5ttGvc00RrKj8CjsiOPPsx7cfbR8OPdhxjHGv8yeynHcepx8uaoeYlzSMtghZ5a3Jr74mwEx1tXm3Hf7b/ue6k0cmaU1qnNpwmni45PX6m8Mxou7j9xVn+2YGOhR33zyWdu3l+7vnuC+EXLl0Mvniuk9l55pL3pZOXPS+fuMK40nLV7Wpzl2vX8V9cfzne7dbdfM39WmuPR09b7+ze09d9r5+9EXjj4k3Wzau35tzqvR1/+05fap/8DvfO0N3su6/uFdwbu7/yAeZB2UO1h5WP9B7V/mr1a5PcTX6qP7C/63Hs4/sDnIHnv0l/+zxY8oTypPKp4dP6Iaehk8PBwz3P5j0bfC5+Pvai9Hf133e8tHz50x9+f3SNJI0MvpK8Gn+97o3Om7q3Lm87RqNHH73LeTf2vuyDzocDHxkfOz8lfno6tugz7nPVF6svbV/Dvz4YzxkfF7Ml7AkpgEIGnJEBwOs6RBsnI9oB0eXEeZPaesKgyf8DEwT+E0/q7wlzA6DOD4D4lQBEIBplFzLMECYjs0ISxfkB2NlZOf5l0gxnp8lcZERZYj6Mj7/RBwDXBsAXyfj42M7x8S/7kGLvAtCeN6npFYZFtPwRjIK6DJaDf9qk3v9Lj/+cgaICF/DP+U9KPRf4wv1dHQAAAIRlWElmTU0AKgAAAAgABgEGAAMAAAABAAIAAAESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAIdpAAQAAAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAAL2gAwAEAAAAAQAAAKoAAAAAe5N6VQAAAAlwSFlzAAALEwAACxMBAJqcGAAAArZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+MTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6UGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbj4yPC90aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNzA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTg5PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+ClLtPaoAAB1aSURBVHgB7Z153FXT98d35pmklDGKIokMmSslYxEypMg8lYr8gfATKvMYCqkolFSaNVDSJEpzaR6QUsiU8dd7+95c97n3nmmvM9y79+v1vJ7nufecffZZe5111v6sz1q71G+//fa3ss1KoIgksFUR3au9VSsBLQGr9FYRik4CVumLbsrtDVultzpQdBKwSl90U25v2Cq91YGik4BV+qKbcnvDVukj0IG///5bLV68WP35558RXN1e0ip9BDqwbt069cgjj6hZs2ZFcHV7yW2sCMKVwO+//66GDRumhg4dqtasWaN69OihSpcuHe4givxq1tKHrAArV65Ub7/9tsLajx49Wr377rvqjz/+CHkUxX05q/Qhz/+QIUPUxx9/rPDrsfrdu3dXixYtCnkUxX05q/Qhzj9WvkuXLuqXX37ZctXZs2erd955R/36669bPrN/yErAKr2sfLf0/vPPP6tOnTqppUuXbvmMP3gABg4cqFB+28KRgFX6EOT8119/qTFjxqi+fftmvdq8efPUm2++qTbTvLN+bz80KwGr9GblmbW3r7/+Wr366qtq48aNWb/Ht3/rrbfUJ598kvV7+6FZCVilNyvPEr2BzAwfPlxNmjRJL15LHPC/D9auXavuvfde9cMPP+Q6xH5uSAJW6Q0JMlc3y5cv127Nhg0bch2y5XNQHSy+hTC3iETkD6v0ImL9p1N8+QEDBqgpU6a4ugowJsGq+fPnuzreHuRPAlbp/cnN1Vng7y+//LICuXHb5s6dqyHMn376ye0p9jiPErBK71Fgbg8Hd3/wwQdLQJRO5/OAEKVF+W2TkYBVegG54ta8//77atCgQb56X7hwoerdu7cNWPmSnvNJVumdZeT5iFWrVqlXXnlFbdq0yfO5nMBDA6Y/YcIEX+fbk/JLwCp9fvl4/pYAExDl5MmT80KUTh1DSHvooYc0Mc3pWPu9NwlYpfcmL8ej4dcQXf3uu+8cj3U6YOLEiapPnz7a8jsda793LwGr9O5l5XgkmVCQx6ZNm+Z4rNsDevXqpXk5wJm2mZGAVXozctS9gLhANzDJofniiy+0f//jjz8aHGlxd2WV3tD8o5SdO3dWRGBNthQL8/PPPzfZbVH3ZZXe0PSPHDlSR18l3BAgzDfeeMPSEwzNlVV6A4JctmyZhiglqxsQsBo7dmwgRMjArRZEF1bpA04jWDwpgJ9++qmoQoIGPfzww+qrr74KOGJ7ulX6gDqwZMkSnej9/fffB+zJ+fSpU6fqSC38e9v8S8AqvX/Z6TNxO0j+kPDlM4eG+wSESaaVbf4lYJXev+zUjBkztC8PbSCsBjoEL8cmm/iXuFV6n7LDxybRe/Xq1T578Hca7M3Bgwerzz77LJS3i79Rxvssq/Q+5gc3g8XriBEjfJwd/BQqKuDm+CW0BR9BsnuwSu9j/rDusCjT69f46Mb3KTx0/fr1U+PHj/fdRzGfaJXe4+zjXrB4jbpODVaeRPKw3SuP4orl4VbpPU4LKYBw3eOwkJw+fbp6/fXXrZvjcQ6t0nsQGCgNtOE48WAYDyhSGJCpB1HF+lCr9B6mBxYlid5xCg7x5qEKsk0kdz+RVuldyoq6Ne3btzeSHOLykq4O4wGk1j3RWmvtXYlMWaV3ISeKL5HkTT3KODYCVj179rTW3uXkWKV3ISj4NRRhiisuzlrjvffeiyxu4EKEsTrEKr3DdKDoWHkWi3Fu+PT33XefolisbfklYJU+v3w0uYtAkJcqZQ5din3NorZr1662Xo6DhK3S5xEQi0SqEUQdiMozxBJf8YBKc/tLXDRhH1ilzzNhVDUg+CNRRXi//fZTW2+9dZ6r+/sKXg4QZhj8fn8jjP4sq/Q55gClIcz/7bff5jjC/8e77LKLateunapZs6b/TnKcydsJFiYPrIUwswvJKn0WuWDZcROoF2+6Yd1PP/101ahRI53+V6ZMGdOX0HwcSpHYsiHZRWuVPkMuWMcFCxZot0Yi0btcuXLqsssuUxUqVFCnnnqquuSSS9S2226bMYrg/0J7BsYMM8El+KjD6cEqfYacYVECUUrxa+rUqaPq16+v/XmsfosWLVSVKlUyRhH8XyBMEslXrFgRvLMC68EqfcaEUmMGFqUERLnHHnuo1q1bK36n2mGHHaaaNGmidtxxx9RHxn6nIMy4BtWM3ajHjqzSpwmMRaBU4jUuzC233KKOPvrotCsqtcMOO6gLLrhAHXXUUf/53NQ/cP/h5Vg351+JWqX/Vxbqo48+0tRh06hHqVKl1HHHHaduvvlmxd+Z7ZBDDlFNmzZV22+/feZXgf8nyQT6sZuN3gJfLCEdWKX/30RRD57tcvhtuu2+++7q+uuvVyxis7VtttlGL2hPPPHEbF8H+oxissOGDdObvZl+mAMNLMKTrdJvFj4oDVtZspGC6bbVVlupunXrqnr16mW18qnrlS5dWi880/391HdBf3/55Zc6DyCqnN6g4zd9ftErPdaPLSypJSMBUZYvX15DlHvvvbfj3OECNW/eXATCHDVqlC4wK3GPjjcWswOKXulBadhIQapqWIMGDXQwKpsvn00XUPpq1arlfStkO8/pM9ycjh07KhCdYm9Fr/Qoe//+/UUgSnx4EBt8eretatWq6uKLL1Y77bST21NcH8cGD6Q7FrubU9RKD4z32muviezQTeAJTN4rFAmE2bhxY1W9enXXyuzlwNQO5sW8qC1apWfSP/jgA81I9KI0bo7FlalVq5a64YYb3Bxe4pjKlSurZs2aaQy/xJcBP6DUN+sXCSJdwKGFdnrRKj0ZRh06dBCpX7PXXnupm266Se22226+JpKHBhcHyoLpBpmOjZ0h0xWrtS9KpSfyCkRJiW3TLcWiRGHdLl6zjWHPPffU6X9ly5bN9nWgz3jgKUsYh4JVgW7E58lFqfSwKKX2cAKavPzyyxVQZdB27LHHqiuvvNJ4sgkWHmsPRaEYW9EpPRxzMotAMkw3LPvZZ5+tTjvtNGNd49sfccQRgd4a2QaD4rMjOTGKYmtFp/QzZ87UQRooxKYbKYDwa8iMMtUqVaqkLr30UrXrrrua6nJLP+xu/tJLLxVdsklRKT0Bmu7du6vFixdvmXhTf2y33XaqTZs2OrBkqk/6SbEwa9SoYbLbLX1RZ59FbTGxMItK6SdMmKAZhxKheCgEkMpYyJpuQJhS9ASsfbGxMItG6aHY3nPPPSLFV4m8tmzZUoQanHqALrroIk1cC4IIpfpK/41vP3r0aB2zKBYIsyiUnswh6tdQz910gxZ8xhln6HxX0wqZPlZ8+vvvv98IKpTeL39/8803ikTy9evXZ35VkP8XvNJjvWbNmqURGwm/dd9999UQJQEp6XbMMcdoN4f1g+lGAg0wroSMTI81aH8Fr/TSLEqsPHx5ePPSjWuA25NXa7qxyCeRXGKRb3qsQfuTn6mgIwx4PltPDhw4UMSXP/DAA1WrVq1E+O+5bptrXnHFFb4pDrn65XO2CX366acLPlJb0EoPhRaIklJ3phtQYtu2bUWsbr6xkkfbsGFDkepoXHf48OE6V1gC4cp3X2F+V7BKjy/PBGLlTaMSLFhr166tLW6Yk5W61kEHHaSuuuoqMRYmEObatWtTlyu43wWr9CAS1KKU2IsJMhjJIX5ZlEG1CN+eymgnn3xy0K5KnI+FHzlypCKmYdpYlLhYRB8UpNJDMSBDSGJRRv2a8847T5f0kIQonfSBcXTq1EmBHpluFK+FnlConPuCU3qsEyX5SAGUgN/2339/zYWRKLzqVXmhJoDmSECYkyZN0oWvJMqUe71P08cXnNJv3LhRl+WTYFEifKw8bkWUVj6lBIyBYrCkJJoeDzkHTzzxRKI2pEjJxel3wSk9LEp44uDOpts+++yj814l6k76HSvV0VD8nXfe2W8XOc9jMfvMM8+IrItyXjSELwpK6QlE4YvCszHdqE7ARma4N3Fq0CDOPfdcdfzxxxu39tzn2LFjNTenkCDMglF6/HfqsUOVNd1SVcpATOLYCFjh20uUDQEFA8IspF0LC0bpqcNOLUqJEtukAFLZwGRyiMmHh4fy/PPP18Q3k/3SFxYea//hhx8WDIRZEEqP/06iswREmXIfJIqrmlRQfPrOnTsriURy6AkvvPCCpimYHHNUfSVe6YEo2UKSyKsERFmxYkUNUUoUVjU96QcffLC68cYbRXj9VI4g9lEIEGbilR4rRKL3smXLTOuQZk6yYQKLxKQ08mnZ+ME0hMn9P/vsswWxR23ilT7FopSAKOG4ULQpThCl08PHmFF8CYoEi9rnn38+8SzMRCs9GVFMAvXXTTfYjA888IA64IADTHct2h/RWd5OEnvUMnBKIVL2W8KVFBVMWueJVXpQBYJQFC0y3UBDKLGN8iSxwce59tprxQJWuJMShiYsWSdW6UFqyPQhXG66Ub8GiFJif1fTY83V3znnnKP44QE22QAOxo0bp41NUq29WYmYlG6evmBRUmJbYoMBFJ0I5wknnCCyGMxzW0a/IqZAIjnUCdMN8KBbt26J5dwnTumxNMBnUhAl0U1qUXrZSMG0Upnq79BDD9UQpsQbCwAB7D6J1j5xSo+VoeLw8uXLTenGln4o1ER9GQqnFkqj5DdVFCQgzC5dumgDhCFKUkuc0sPzhl8jESShygBVyojCFkqDIEciObsXmm6U+n7uuecSVy8nUUpP6t+LL74oQn6CrNW+ffvEQZROigyESQ4Aby8Jaw8nBwQtSSzMxCg9r1B2ASR/0/TrFGUA6WjUqJGTDiXyeyDM6667ToSekGJhsq1PUloilB4lX7hwoWZRSgiWABQQZSG5NZlyom4+qJRpCJPrkERO5YmkLGoTofS4NZCdVq1alTmXgf8n8oqFh69SyI37BMKEQGe6sdEF85OUgFXslR7rMWXKFL14lbAkklwV08oVtL8qVaqIuTnUC2VRKxEsDHrfmefHXulBCAh7S1QpQxhAetSWl1jkZQo76v+5xyZNmohAsixkUyzMqO/T6fqxx+bwF4cNG2Z88YpggCjhqCQJeXCaUKfvyQKDhTlnzhzjSSHIkQoKIGxhVHF2utdc38da6bHyRP1ACEw3AlEs7pZt5uHzU0yNCm0gOgT6TLfUopaodlyBgdgqPVajZ8+eavz48abnRSMY1apV09FEUIck+KGmhAB6Q6AKUh0uo+mc4g0bNuiI+SmnnKJYL8WxldqcfBHLGDLFmiiqJGGNiFKyAQHWHqYmUV6J68RtwrG8bM8JZk+tHHZC7Nevn/FhEhB78skndXQ7jmulWC5kqVJGcgg1FU03SmyzeGXySQPs0aOHLvQKZAmsV4gNZQeqZP0CO5WYBJlV7CMrYY3JYsOvl+BHmZifrTdX9v0/Ex2Z6gNYEpeGyloS1rdq1arqrrvu0krAmEkFpCwei1oeNmIBZGQVSuMh5+G+/fbb9WZw6QVfcXNw7dhS0zSXad26dRp8qFOnTux8+9hZeirlUlxIIhCFP8sC68gjj/yPTmPh2eX78ccf1zuLgHDE8bX8n0G7+IcHGnrFo48+qqHKbKX/yA6rVauW8fslis5bFANmmjbi4tbzHhI7Sw+BifotEjt6E5zhtZst0RslZwc/FADyGZWPiTQmtXEvKDT3iwuTa39b8gaw8my0ZvoNh5sD8gb9IZvMpWXLYrVUlovEytLjzjz11FPazcgy1kAfUbcGi+e03TyTg+/Lhg5wciS4KoFuxOFkHt4KFSqoW2+9VcO9TvfL/QHdnnrqqcatPUNNVauIAiHLpvCMKTZKj7XhdYh/abph5bB69erVc9U1is/2Nh06dFBUBU6S4pcvX16XLWnTpo1r68pDwoMuUbYQCJOIepwWtbFReiKE+NQS0dFKlSqpFi1aeEr0BnajYCv1MXEPkuDjo7QgM0CRBKC8NAwCqJbp+8Sfnzhxohh3yss9po6NhdKzCyAQpcTmXkHqwAD14Y/eeeedsQ6rM5m8nXiwQab8lCAE5SFmIZFIzvqM1MI1a9ak9C6635sd/ciVHoiSqrj8SKzygSIhWTGpfhpJ1XBV8JGzoR9++jR9Dgvvpk2bqo4dOwZyxeDL4BZJlPzGvSEuIAFQeJLnZkc/cqXHugNRSnCxsdQoA4GoIA1lp7xf8+bNYxfA4qFk1/I77rjD94OdLhtKflP+RGId07t3b23cJCji6ffg9HfkSg9URgqghC9PFQBe+bngOifhpH+Pj8xOJCAdPExxabzJUHgqFptocHIwFBKJ5PB8cGMlCIRe7j1SpQcHh4oqQTdgUffYY48ZnTxe/2QfgffHoeGGoPAmLTMPNInkUpWaqVk0aNAgESPndk4iU3ogSgIn1JY33Zg4Iq8kh5huFFDC7yVqG2VjjcIGzhJbAvFWAwGSqHyMgevbt6/IBhpu5yMSpWfBStCCTBvTDcgNbJ09mEy4NZnjw4du2LCh3u4mKjeH+6pfv75q166dyD1yz3Xr1tUAgIRvP23aNFfWXor+G4nSQ+xiF0AJ3w4L2Lhx4xL8mkzlDfI/lrBt27b64QrSj99z8d9bt27tGYv3cj34SNQBMrVWSL82EDWJ5E4Bq1wR1fS+/PwdutKzcqfG+ZgxY0QgStwPuOLSXA8CXgTTwoYxeahx3fDjpRuMTFw5Cco12WrU/5fYTCOvXKLA6bHu1KKU2KIRdwO3BvpwGA2okOtJFEjNNX7WKTzUEoqY7ZqwNKV4Ofj2VEcLFcIMG6fHlx89erSIlceXJ9OqWbNm2eZO7DNqXxIHMB2+zzZgrDwbqfGWCavB5QHClEj0BqYGwpSgkeeTT6juDSxKFq8SySGE3gmjS+DL+QTIohl3Q4KslX5dHirWKiyiw3jAUtfm7XnWWWcpthSVuC6LWja99sXC9LnSDU3peYWRDTVjxoyUPI39BmGgMm8UJbZxMy688EJVo0YNY/eTrSMsbadOncTXKrmuDQ1Dgp5AxQvcnCVLlmS7dP7P/rPSdf8EhKL0uDU80VTAMt2wPvjwUAQk4DU344V3DxVZys+GNIdbg6sRVatdu7Z+o0nAwKl9gIOlLP7nCcgrplCUHk419WskMpGwPhDKwlq85pImfH3WFBKNciW4NlE91NwT14bBKSFnXBt2fJ8/f76E+Er0Ka70uDWSLEomgaikNERZQnIZH5B2B0XBtAvA4hV6M2uHqBulU1q2bCki6zBZmOJKD0QJi1ICosT6UMMlDgqBQrLYg6VoslWsWFFbeZQ/Do1FrRSEyRapFN+SoJiny05U6Rk8OCyW3nTDl0f4ICdxaldffbUqV66ckSFxj2eeeabCvYlLI7VQCsLkHkH3pCFMUaUnU4bFK/XlTTcIXyQlmHYngo4TzB5ejAn/G/j1mmuuMdJX0PtKnc99EZRjYSsBYc6cOVP179/feGWG1Pj5Lab0LE4o7UbdctMN7BhrA18+bg1eDpz7MmXKBB4a9xgXGnP6zZQtW1Yn1ThVWkg/x+3f8LIoNUhZR1/NBXIppvSS+4yyeCXyGhXLMd9kYAmxgkFRDhQKUpuJN0a+8fr9juJYzIGEtQ+0T7AL5FJE6alSRiDKV5TNYRYgeME9icviNdtwwdNJxPCLaaNIQJQSSdrZxuv3M1iYUm8iWJhz5871O7S85xlXegIMLF6lyrlRko8NjqUCQXml5eFLymn4DSbhy0eNy7u5VaLEt912m2MBLTd9ZR7DboWwMCViO8aVnsHCopQo5wGbEYhSotJuptCD/k+uKfm5fl7/0CmgNfg5N+i4vZ7P+gV3TsINYwcaUgtNszCNKz21KEeNGiWCtRLxhGMjIWCvk+10PApLIMcrEQ3KARsaxN21Sd0/nHvcTRbwphvuMeif6T1qjSr96tWrdWJFMA5FdtGBD5PonQSFT90BCA70BC8NJZKynF7G4eVYIFrSCyXeTOwf3KdPH6P1cowpPRkwVDaYN2+eF3m5OhbrB6GrevXqro6P00GsP7xAe+D8maXE43Q/2caClacukJ/Katn6S/8Mn56d4hcsWJD+caC/jSg9kVfq1/Tq1SvQYHKdTG0XFoZJsvKpe0GJ3W7MjKWEphx2CmJqrNl/uwC+N59I+iJxBYk2e/ZsXQTWlAdhROnhRBM+5rdEIxjCgyUBgUqMN71P3DLcFTfwJW8E09yd9LH4+9sZ+GahSWmPoLGJXONj3rt162ZsL+HASs/TN3jwYL1TX65BB/2cFEMWsF27dtWvOVwpaVJS0DGnzgdxIq/VDXzJgtDrwjd1nSh+o+zEZCCJ4d4AX0o1DColT0wY1sC7C0IJpegQiI10IwJLSWmUg8UTb4AkuDwwTHlocQFzNdYt48aNiyW1InPMGBwKsbJ+Y5fGIUOG6HIe0oaIucbwEQl28+bMHHfq/0BFGbnJoUOH5p3M1IVM/OatwsNFyiFKT5i+cuXKsSOdZd4rrEvgVjacyIU5s3jF/497I5kbCBF+TI/Nm2gsXrw4tDIeyA6lP+mkk3xE5Fmb/OOqBXJvyIgCRgyz/DI3DnuTCrjwP8i4gbMvUQDWlAJioUjozscVotRGmKVE/NwbRZqmTp2qdy25++67taUPu24Ni1pyar2v7/5dm/hWehSdfZnA5qNqVMFF+Gwdw7pi/fr1sVV+tu3krZStUTPSZBHWbNfw+xlvc+Q8ffp0vWcXKBrFuqIyMujdgAEDArF3fe0uiCBIDCE9zvsT51f82c9D+Lxi2eKFBxDeCpwQrKpEsCT7KJw/xQdlEZYtoQZIk6JRJujIziNxfwTuJPsGQCshBsNvidwI9yP650j2qAXWdYuKZfbvayGLO8HeRnAj4tRQLFh/ZFPxQ3QzyILH9L2tWLFC++3p7iAPJnwidj6MCz6PUSMoRAULciJwaahVxOdxaQTEWED7Kfvi2b3Bp0bZsaxxa1h96Ki4XZQEobREHCxTSk6UCsksHw5ECbksLgqPDEHk2GAOMhkbZrB2i5PCI09cWXZBTzcgKTk7/fas9BTeJNFbokqZ02C9fD9p0iTVoEEDTU/FYqH8cZg4xpTuduGKxYF2gCsDKgNAALxKsDEX0uRlHiSPnTx5soZMva4vPEGWKA1UTxQqCS213Qv4OLVx2DAN+DBKlISKCVh30uJoRGylIplu5og5JZo6YcIEbcyAhONu0NLvi2QTIMzDDz88/eO8f3uy9CtXrtQFN/28UvKOQvBLLBhuDiXxcHmIHrKgjMqKwbNPzzaqWbOmomZOFA0QYtGiRTrBnpgHxK4kKTwyI0DGuIFT3TbXSo+ASA9D8ZPYUtYMlIT7oHai19eiifsGoUkv6QF3Pt3dMXENpz5S1n3EiBE6foArgx8fB/fPaeyZ32OAUXovqYWulB5hwH+hNEPSGy4Pu6DACCSEzhqFt0FYDVIZrFFoB7hZtWrVCuvS+u3GW+7DzYk+8GRw+XwVTg1txO4uRDlA1iJuA2WufHqwWjZFC1M53N2u/6OgMrRq1UojFMCbRHfB+KWtLtFZ3BsWsPzg04fRNm3apFmKKAfBHdyaqFw8ifsl0YSEHebRqTkqPYoOv4bFaxJff/kEwKuR2ujg0NAE2McJn1s66Rylp1gVRZOkCXMoNvDewIED9RuOejJe/N988ovTd9wjBWZZszntiujo3uDD8xThExdiw68nkovLAwoAHAsuLWkFK1asqANn8G0kG697uCpsj8kDTfWwQlT4lAypl9OzZ0/HuXO09Fh5eBf4oIXewPLhbMMtoSYl8KKE1YciwWsYPo5E40FeunSptnpsb8NDjdtWDHPIOo36n2y4l6s5Kj3uDWHyYmtz5szReztRnlqi4X9KlRdnsc7iDtoDRaeKqVHd2Ql2deTemMhUSarQQVekFJP1kcyi+e/NgMOfOjwf2EX7l4KeqCnk7ZzvDe2o9Im6WzvYGEgg/k+K40I2BlK0Q0iUBP5N1vA27PAYnFbpvc2MPVpMAn4fFu8DskrvXWb2jIRLwCp9wicw6PDDcyqCjtT/+Zn3aJXevywL4szwnIroxJV5j1bpo5sLe+WIJGCVPiLB28tGJwGr9NHJvvCvnOlMx+SO/x9mFgk/UnLadQAAAABJRU5ErkJggg==`; // ND
    return renderTokenIcon({tokenLogo, onClick: () => {
      const provider = web3.web3.givenProvider;
      if ( provider ) {
        provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: '0x9ea3b5b4ec044b70375236a281986106457b20ef',
              symbol: 'DELTA',
              decimals: 18,
              image: 'https://pbs.twimg.com/profile_images/1359363227084324864/GqXwB7lC.jpg'
            }
          }
        });
      }
    }});
  };

  const renderAddRLPToken = () => {
    return renderTokenIcon({tokenLogo: () => {
      return <div>rLP</div>
    }, onClick: () => {
      const provider = web3.web3.givenProvider;
      if ( provider ) {
        provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: '0xfcfc434ee5bff924222e084a8876eee74ea7cfba',
              symbol: 'RLP',
              decimals: 18,
              image: 'https://pbs.twimg.com/profile_images/1359363227084324864/GqXwB7lC.jpg',
            }
          }
        });
      }
    }});
  };

  const renderConnectWalletButton = () => {
    return <div className="flex flex-col big-is-flex-row">
      <button
        type="button"
        onClick={() => {
          if (!wallet?.account) {
            modalContext.showConnectWallet();
          } else {
            wallet.reset();
          }
        }}
        className="menu-link menu-link-disconnect topbar-dyn-fontsz flex uppercase text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-none text-small font-medium"
      >
        {wallet?.account ? <>
          Disconnect Wallet</> :
          <>Connect Wallet</>}
      </button>
      <button
        type="button"
        onClick={() => {
          if (!wallet?.account) {
            modalContext.showConnectWallet();
          } else {
            wallet.reset();
          }
        }}
        className="menu-link menu-link-disconnect-small topbar-dyn-fontsz flex uppercase text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-none text-small font-medium"
      >
        {wallet?.account ? <>
          Disconnect</> :
          <>Connect wallet</>}
      </button>
      {wallet?.account &&
        <a className="menu-link menu-link-wallet-id topbar-dyn-fontsz text-gray-300 md:flex px-3 md:self-center text-sm" href={`https://etherscan.io/address/${wallet.account}`} rel="noopener noreferrer" target="_blank">
          {shortenAddress(wallet.account)}
        </a>}
    </div>
  };

  return (
    <div>
      <nav className="bg-black uppercase">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/"><img alt="logo" src={logo} height="150" width="150" className="w-8/12 md:w-full" /></a>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {renderMenuItems()}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  {renderAddDeltaToken()}
                </div>
                <div className="ml-3 relative">
                  {renderAddRLPToken()}
                </div>
                <div className="ml-3 relative">
                  {renderConnectWalletButton()}
                </div>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setMenuVisible(m => !m)} type="button" className="bg-black inline-flex items-center justify-center p-2 rounded-none text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-black" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden ${!menuVisible ? 'hidden' : ''}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderMenuItems()}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="ml-2">
                {renderConnectWalletButton()}
              </div>

              <div className='inline-flex flex-row mr-8'>
                <div className="ml-3 relative">
                  {renderAddDeltaToken()}
                </div>
                <div className="ml-3 relative">
                  {renderAddRLPToken()}
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;

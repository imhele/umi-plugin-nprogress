import { ReactElement, useCallback } from 'react';
import styles from './index.less';

export default function IndexPage(): ReactElement {
  const onClick = useCallback(() => {
    fetch('/api/timeout');
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <button onClick={onClick} type="button">
        点击以发起请求
      </button>
    </div>
  );
}

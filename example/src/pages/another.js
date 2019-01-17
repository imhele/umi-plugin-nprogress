import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.css';
import { PureComponent } from 'react';

class Another extends PureComponent {
  constructor(props) {
    props.dispatch({
      type: 'global/waitForMe',
      timeout: 200,
    });
    super(props);
  }

  render() {
    return (
      <div className={styles.normal}>
        <div className={styles.welcome} />
        <ul className={styles.list}>
          <li><Link to='/'>Back to index</Link></li>
        </ul>
      </div>
    );
  }
}

export default connect(() => ({}))(Another)

import { AdminOfferWhereForm } from "@/widgets/Admin";
import styles from "./AdminOfferWherePage.module.scss";

const AdminOfferWherePage = () => (
    <div className={styles.wrapper}>
        <h1 className={styles.title}>Где вы находитесь или будете принимать волонтеров</h1>
        <AdminOfferWhereForm className={styles.form} />
    </div>
);

export default AdminOfferWherePage;

import { useParams } from "react-router-dom";
import { AdminOfferWhereForm } from "@/widgets/Admin";
import styles from "./AdminOfferWherePage.module.scss";

const AdminOfferWherePage = () => {
    const { id } = useParams<{ id: string; }>();
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Где вы находитесь или будете принимать волонтеров</h1>
            {id && <AdminOfferWhereForm className={styles.form} offerId={id} />}
        </div>
    );
};

export default AdminOfferWherePage;

import admin from 'firebase-admin';
import '../config/firebase.js';

const db = admin.firestore();

export async function salvarUsuario(usuario: any) {
    const ref = db.collection('usuarios').doc(usuario.cpf);
    await ref.set(usuario, { merge: true });
    return { id: ref.id };
}

export async function salvarAssinatura(assinatura: any) {
    const ref = db.collection('assinaturas').doc(assinatura.idAssinatura);
    await ref.set(assinatura, { merge: true });
    return { id: ref.id };
}

export async function salvarBeneficiarioRapidoc(beneficiario: any) {
    const ref = db.collection('beneficiarios').doc(beneficiario.cpf);
    await ref.set(beneficiario, { merge: true });
    return { id: ref.id };
}

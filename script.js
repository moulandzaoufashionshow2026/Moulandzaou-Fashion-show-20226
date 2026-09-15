import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ================= FIREBASE =================

const firebaseConfig = {
    apiKey: "AIzaSyBtAZ4SDvrVOy2XSAjodWtnCgwh8PcKgc0",
    authDomain: "moulandzaou-invitation.firebaseapp.com",
    projectId: "moulandzaou-invitation",
    storageBucket: "moulandzaou-invitation.firebasestorage.app",
    messagingSenderId: "1011293979555",
    appId: "1:1011293979555:web:0279bbbc6313286caf9016",
    measurementId: "G-4TZ9BXTBSR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ================= ÉLÉMENTS =================

const form =
    document.getElementById("invitationForm");

const invitationSection =
    document.getElementById("invitation");

const invitationResult =
    document.getElementById("invitationResult");

const guestName =
    document.getElementById("guestName");

const guestEmail =
    document.getElementById("guestEmail");

const qrCode =
    document.getElementById("qrcode");

const invitationId =
    document.getElementById("invitationId");


// ================= FORMULAIRE =================

form.addEventListener("submit", async function (event) {

    event.preventDefault();


    // ================= RÉCUPÉRATION =================

    const prenom =
        document.getElementById("prenom").value.trim();

    const nom =
        document.getElementById("nom").value.trim();

    const telephone =
        document.getElementById("telephone").value.trim();

    const email =
        document.getElementById("email")
        .value
        .trim()
        .toLowerCase();


    // ================= VÉRIFICATION EMAIL =================

    try {

        const emailQuery = query(
            collection(db, "invites"),
            where("email", "==", email)
        );

        const emailResult =
            await getDocs(emailQuery);


        // Si l'e-mail existe déjà

        if (!emailResult.empty) {

            alert(
                "Cette adresse e-mail possède déjà une invitation.\n\n" +
                "Une seule invitation est autorisée par adresse e-mail."
            );

            return;
        }


        // ================= ID UNIQUE =================

        const id =
            "MZ-" +
            Date.now()
                .toString(36)
                .toUpperCase() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();


        // ================= FIREBASE =================

        const docRef = await addDoc(
            collection(db, "invites"),
            {
                prenom: prenom,
                nom: nom,
                telephone: telephone,
                email: email,
                invitationId: id,
                statut: "valide",
                dateInscription: new Date()
            }
        );


        console.log(
            "Invitation enregistrée :",
            docRef.id
        );


        // ================= AFFICHAGE TICKET =================

        guestName.textContent =
            prenom + " " + nom;

        guestEmail.textContent =
            email;

        invitationId.textContent =
            "ID INVITATION : " + id;


        // ================= QR CODE =================

        qrCode.innerHTML = "";

        new QRCode(qrCode, {

            text: id,

            width: 160,

            height: 160,

            colorDark: "#000000",

            colorLight: "#ffffff",

            correctLevel: QRCode.CorrectLevel.L

        });


        // ================= AFFICHER LE TICKET =================

        invitationSection.style.display =
            "none";

        invitationResult.style.display =
            "block";


        invitationResult.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Erreur Firebase :",
            error
        );

        alert(
            "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer."
        );
    }

});

// ================= RETROUVER UNE INVITATION =================

const findInvitation =
    document.getElementById("findInvitation");

const findInvitationBox =
    document.getElementById("findInvitationBox");

const searchInvitation =
    document.getElementById("searchInvitation");


// Afficher la recherche

findInvitation.addEventListener("click", function () {

    findInvitationBox.style.display = "block";

});


// Rechercher l'invitation

searchInvitation.addEventListener("click", async function () {

    const email =
        document.getElementById("searchEmail")
        .value
        .trim()
        .toLowerCase();


    // Vérifier que l'e-mail est renseigné

    if (!email) {

        alert("Veuillez entrer votre adresse e-mail.");

        return;
    }


    try {

        const emailQuery = query(
            collection(db, "invites"),
            where("email", "==", email)
        );


        const result =
            await getDocs(emailQuery);


        // Aucune invitation trouvée

        if (result.empty) {

            alert(
                "Aucune invitation n'a été trouvée avec cette adresse e-mail."
            );

            return;
        }


        // Récupérer les données

        const invitation =
            result.docs[0].data();


        const prenom =
            invitation.prenom;

        const nom =
            invitation.nom;

        const invitationEmail =
            invitation.email;

        const id =
            invitation.invitationId;


        // ================= AFFICHER LE TICKET =================

        guestName.textContent =
            prenom + " " + nom;

        guestEmail.textContent =
            invitationEmail;

        invitationId.textContent =
            "ID INVITATION : " + id;


        // ================= RECRÉER LE QR CODE =================

        qrCode.innerHTML = "";

        new QRCode(qrCode, {

            text: id,

            width: 160,

            height: 160,

            colorDark: "#000000",

            colorLight: "#ffffff",

            correctLevel: QRCode.CorrectLevel.L

        });


        // ================= AFFICHER LE TICKET =================

        invitationSection.style.display =
            "none";

        invitationResult.style.display =
            "block";


        invitationResult.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Erreur lors de la recherche :",
            error
        );

        alert(
            "Une erreur est survenue lors de la recherche."
        );
    }

});
<template>
<div class="container mx-auto">
    <div class="min-w-full border rounded lg:grid lg:grid-cols-3">
        <div class="hidden lg:col-span-3 lg:block">
            <div class="w-full">
                <div class="relative flex items-center justify-between p-3 border-b border-gray-300">
                    <div class="flex items-center">
                        <img class="object-cover w-10 h-10 rounded-full" :src="require('../assets/login.png')" alt="username" />
                        <span class="block ml-2 font-bold text-gray-600">Phòng chat CYVN</span>
                        <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
                        </span>
                    </div>
                    <div>
                        <button @click="handlerLogout">
                            Đăng xuất
                        </button>
                    </div>
                </div>

                <div  id="messages" class="relative w-full p-6 overflow-y-auto h-[40em]">
                    <ul class="space-y-2" >
                        <li  v-for="(item, index) in getMessagesByComputed" :key="index" :class="data.email == item.email ? `justify-end items-end` : `justify-start items-start`" class="flex  flex-col w-full">
                            <span class="block">{{item.email}}</span>
                            <div class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                                <span class="block">{{item.message}}</span>
                            </div>
                            <div v-if="item.img" class="w-[17rem] h-[10rem] ml-2 my-2 relative  overflow-hidden rounded">
                                <img class="w-full h-full object-fill" :src="item.img" :alt="item.img">
                            </div>
                        </li>
                    </ul>
                </div>
                <form @submit.prevent="onFormSubmit">
                    <div v-if="showImg" class="w-[10rem] ml-2 mb-2 relative h-[10rem] overflow-hidden rounded">
                        <img class="w-full h-full object-cover" :src="showImg" :alt="showImg">
                        <div>
                            <p @click="handlerDelImg" class="absolute cursor-pointer font-bold top-2 text-white right-2">X</p>
                        </div>
                    </div>
                    <div class="flex items-center justify-between w-full p-3 border-t border-gray-300">
                        <input @change="(e) => (handlerImg(e))" id="img" class="hidden" type="file">
                        <label class="cursor-pointer" for="img">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </label>
                        <input v-model="messageUser" type="text" placeholder="Message" class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700" name="message" required />
                        <button>
                            <svg class="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    auth
} from "@/firebase";
import {
    getStorage,
    ref,
    uploadBytes
} from "firebase/storage";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
    addDoc,
    query,
    where
} from 'firebase/firestore';
import {
    db
} from '@/firebase';

export default {
    name: "ChatBox",
    data() {
        return {
            data: JSON.parse(localStorage.getItem('data')),
            messageUser: '',
            dataMess: [],
            img: null,
            showImg: null
        };
    },
    methods: {
        async onFormSubmit() {
            try {
                const collectionRef = collection(db, 'messages');
                await addDoc(collectionRef, {
                    email: this.data.email,
                    message: this.messageUser,
                    user: auth.currentUser.uid,
                    token: this.data.idToken,
                    date: new Date,
                    img: !(this.img === null) ? this.img[0] : null
                });
                this.messageUser = '';
                this.showImg = null
                this.img = null
                document.getElementById('messages').scrollTo(0, 1000000);
            } catch (error) {
                alert(error.message)
                console.log(error.message);
            }
        },
        handlerLogout() {
            auth.signOut();
            localStorage.removeItem('data');
            this.$router.push('/');
        },
        async getMessages() {
            try {
                let unsub = null;
                const collectionRef = collection(db, "messages");
                unsub = onSnapshot(collectionRef, (snapShot) => {
                    const users = [];
                    snapShot.forEach((doc) => {
                        users.push({
                            id_user: doc.data().user,
                            email: doc.data().email,
                            message: doc.data().message,
                            token: doc.data().token,
                            date: doc.data().date,
                            img: doc.data().img,
                        });
                    });
                    this.dataMess = users.sort((a, b) => (a.date.seconds - b.date.seconds));
                })
                document.getElementById('messages').scrollTo(0, 1000000);
            } catch (e) {
                console.log(e)
            }
        },
        async handlerImg(e) {
            let file = e.target.files[0];
            let data = []
            let reader = new FileReader();
            reader.onloadend = async function(fileLoadedEvent) {
                let srcData = fileLoadedEvent.target.result;
                await data.push(srcData)
            }
            reader.readAsDataURL(file);
            this.img = data;
            this.showImg =  URL.createObjectURL(file)

        },
        handlerDelImg() {
            this.showImg = null
            this.img = null
        },
    },
    computed: {
        getMessagesByComputed() {
            return this.dataMess;
        }
    },
    mounted() {
        this.getMessages();
        document.getElementById('messages').scrollTo(0, 1000000);
    }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 20px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
}
::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb {
  background-color: #d6dee1;
  border-radius: 20px;
  border: 6px solid transparent;
  background-clip: content-box;
}

</style>

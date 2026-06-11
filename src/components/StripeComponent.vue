<template>
  <div class="stripe-wrapper border rounded-2 px-2 py-3 mb-2">
    <StripeElements v-slot="{ elements }" ref="stripeElement" :stripe-key="stripePublicKey">
      <StripeElement ref="stripeCardElement" :elements="elements" :options="cardOptions" />
    </StripeElements>
  </div>
</template>
<script>
import { loadStripe } from '@stripe/stripe-js'
import { StripeElements, StripeElement } from 'vue-stripe-js'
import { notificationService } from '@/services/_singletons';

export default {
  name: 'StripeComponent',
  emits: ['handleCardValidation'],
  expose: ['generateToken', 'clearCardDetails'],
  props: {
    amount: {
      type: Number,
      required: true
    },
    value: {
      type: [String, Number]
    },
    inputClass: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  components: {
    StripeElements,
    StripeElement
  },

  data() {
    return {
      stripePublicKey: import.meta.env.VITE_APP_STRIPE_KEY,
      instanceOptions: '',
      showStripe: false,
      stripeLoaded: false,
      cardOptions: {
        // https://stripe.com/docs/stripe.js#element-options
        // hidePostalCode: true,
        style: {
          base: {
            iconColor: 'gray',
            color: 'black',
            fontWeight: '500',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            padding: '50px',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
              color: 'black'
            },
            '::placeholder': {
              color: 'gray'
            }
          },
          invalid: {
            iconColor: 'red',
            color: 'red'
          }
        }
      }
    }
  },
  computed: {
    elementsOptions() {
      return {
        ...this.defaultElementsOptions,
        amount: this.amount * 100
      }
    }
  },
  watch: {
    // value(newVal) {
    //   this.localValue = newVal
    // }
  },
  created() {
    const stripePromise = loadStripe(this.stripePublicKey)
    stripePromise.then(() => {
      this.stripeLoaded = true
    })
  },
  methods: {
    handleStripeElementOnChange(e) {
      this.$emit('handleCardValidation', e)
    },
    clearCardDetails() {
      this.$refs.stripeCardElement.stripeElement.clear()
    },
    async generateToken() {
      const cardElement = this.$refs.stripeCardElement.stripeElement
      if (!cardElement._complete) {
        notificationService.showError('Please complete the card details')
        return
      }
      // const result = await this.$refs.stripeElement.instance.createToken(cardElement)
      const result = await this.$refs.stripeElement.instance.createPaymentMethod({
        card: cardElement,
        type: 'card'
      })
      if (result.paymentMethod) {
        return result.paymentMethod
      } else {
        notificationService.showError(result.error.message)
      }
      return null
    }
  }
}
</script>
<style scoped>
label.required::after {
  content: ' *';
  color: #ce364f;
}
</style>

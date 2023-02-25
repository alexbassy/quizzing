<script lang="ts" setup>
import { useSubscription } from '@vueuse/rxjs'
import { take } from 'rxjs/operators'
import { useRoute, useRouter } from 'vue-router'
import { getQuestionIdByIndex, getRound$ } from '@/lib/store/client'
import { Routes } from '@/routes'

const route = useRoute()
const router = useRouter()

const roundId = String(route.params.roundId)

// Redirect the user to the last played question of the round
useSubscription(
  getRound$(roundId)
    .pipe(take(1))
    .subscribe(async (round) => {
      if (!round) {
        return router.push({ name: Routes.NotFound })
      }
      const questionReached = round.questionReached
      if (!questionReached) {
        return router.push({ name: Routes.PrePresent, params: { roundId } })
      }
      const questionId = await getQuestionIdByIndex(round.quizId!, round.questionReached!)
      router.push({ name: Routes.Present, params: { roundId, questionId } })
    })
)
</script>

<template><i /></template>

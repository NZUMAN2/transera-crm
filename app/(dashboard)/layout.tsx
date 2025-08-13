'use client'

import ChatBox from '@/components/chat/ChatBox'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine,
  RiBriefcaseLine,
  RiUserLine,
  RiBuilding2Line,
  RiFlowChart,
  RiBarChartBoxLine,
  RiFileListLine,
  RiMapPinLine,
  RiCalculatorLine,
  RiTeamLine,
  RiMenu3Line,
  RiCloseLine,
  RiNotification3Line,
  RiSearchLine,  // ADD THIS LINE - IT'S MISSING!
  RiMoonLine,
  RiSunLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiMailLine,
  RiTaskLine,
  RiFileList3Line,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiHome2Line,
  RiPieChartLine,
  RiUserStarLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,  // ADD THIS TOO IF MISSING
  RiHeartLine,
  RiStarLine,
  RiRocketLine,
  RiFireLine,
  RiTrophyLine,
  RiSparklingLine
} from 'react-icons/ri'